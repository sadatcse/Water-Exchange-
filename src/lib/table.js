// Small helper over one MariaDB table (src/lib/schema.js) — converts rows to plain objects (id → _id, JSON
// columns parsed, 0/1 → booleans) and back. Services write their own WHERE clauses:
//   Product.find({ where: { published: true }, orderBy: { order: 1, createdAt: 1 }, columns: ['slug', 'name'] })
//   BlogPost.find({ where: '`published` = 1 AND `publishedAt` <= ?', params: [new Date()], limit: 9 })
// `where` is either { column: value } (all equal) or an SQL string with ? placeholders.
import connectDB, { query, newId } from './db.js';
import { TABLES } from './schema.js';

export const q = (col) => `\`${col}\``;

// "%text%" for LIKE, with the user's own % _ \ matched literally (comparisons are case-insensitive)
export const contains = (text) => `%${String(text).replace(/[\\%_]/g, '\\$&')}%`;

export function defineTable(name) {
  const { columns, timestamps } = TABLES[name];

  const toDoc = (row) => {
    if (!row) return null;
    const { id, ...rest } = row;
    const doc = { _id: id };
    for (const [col, value] of Object.entries(rest)) {
      const def = columns[col];
      if (!def) doc[col] = value;
      else if (def.kind === 'json') {
        try {
          doc[col] = value ? JSON.parse(value) : structuredClone(def.fallback);
        } catch {
          doc[col] = structuredClone(def.fallback);
        }
      } else if (def.kind === 'bool') doc[col] = Boolean(value);
      else if (def.kind === 'text') doc[col] = value ?? '';
      else doc[col] = value;
    }
    return doc;
  };

  // Only known columns are written; unknown keys (_id, computed fields) are ignored
  const toRow = (data) => {
    const row = {};
    for (const [col, value] of Object.entries(data)) {
      const def = columns[col];
      if (!def || value === undefined) continue;
      if (def.kind === 'json') row[col] = JSON.stringify(value ?? def.fallback);
      else if (def.kind === 'bool') row[col] = value ? 1 : 0;
      else if (def.kind === 'date') row[col] = value ? new Date(value) : null;
      else if (def.kind === 'num') row[col] = Number(value) || 0;
      else if (def.kind === 'ref') row[col] = value ? String(value) : null;
      else row[col] = value === null ? '' : String(value);
    }
    return row;
  };

  function whereSql(where, params = []) {
    if (!where) return ['', []];
    if (typeof where === 'string') return [` WHERE ${where}`, params];
    const entries = Object.entries(toRow(where));
    if (!entries.length) return ['', []];
    return [` WHERE ${entries.map(([col]) => `${q(col)} = ?`).join(' AND ')}`, entries.map(([, v]) => v)];
  }

  const orderSql = (orderBy) => {
    if (!orderBy) return '';
    if (typeof orderBy === 'string') return ` ORDER BY ${orderBy}`;
    return ` ORDER BY ${Object.entries(orderBy).map(([col, dir]) => `${q(col)} ${dir < 0 ? 'DESC' : 'ASC'}`).join(', ')}`;
  };

  const select = (cols) => (cols ? ['id', ...cols.filter((c) => c !== 'id' && c !== '_id')].map(q).join(', ') : '*');

  const table = {
    name,

    async find({ where, params, orderBy, limit, offset = 0, columns: cols } = {}) {
      await connectDB();
      const [w, p] = whereSql(where, params);
      const page = limit ? ` LIMIT ${Math.max(0, Math.floor(offset))}, ${Math.max(0, Math.floor(limit))}` : '';
      return (await query(`SELECT ${select(cols)} FROM ${q(name)}${w}${orderSql(orderBy)}${page}`, p)).map(toDoc);
    },

    async findOne(where, params, opts = {}) {
      return (await table.find({ ...opts, where, params, limit: 1 }))[0] || null;
    },

    async findById(id, opts = {}) {
      if (!id || typeof id !== 'string') return null;
      return table.findOne('`id` = ?', [id], opts);
    },

    async count(where, params) {
      await connectDB();
      const [w, p] = whereSql(where, params);
      return Number((await query(`SELECT COUNT(*) AS n FROM ${q(name)}${w}`, p))[0].n);
    },

    // [{ _id: value, count }] — like a MongoDB $group by one field
    async countBy(col, where, params) {
      await connectDB();
      const [w, p] = whereSql(where, params);
      const rows = await query(`SELECT ${q(col)} AS v, COUNT(*) AS n FROM ${q(name)}${w} GROUP BY ${q(col)} ORDER BY n DESC`, p);
      return rows.map((r) => ({ _id: columns[col]?.kind === 'bool' ? Boolean(r.v) : r.v, count: Number(r.n) }));
    },

    async distinctCount(col, where, params) {
      await connectDB();
      const [w, p] = whereSql(where, params);
      return Number((await query(`SELECT COUNT(DISTINCT ${q(col)}) AS n FROM ${q(name)}${w}`, p))[0].n);
    },

    async insert(data) {
      await connectDB();
      const now = new Date();
      const row = { ...toRow(data), id: data._id || newId(), createdAt: data.createdAt ? new Date(data.createdAt) : now, ...(timestamps && { updatedAt: now }) };
      await query(`INSERT INTO ${q(name)} SET ?`, [row]);
      return table.findById(row.id);
    },

    async updateById(id, data) {
      if (!id || typeof id !== 'string') return null;
      await connectDB();
      const row = { ...toRow(data), ...(timestamps && { updatedAt: new Date() }) };
      delete row.createdAt;
      if (Object.keys(row).length) await query(`UPDATE ${q(name)} SET ? WHERE \`id\` = ?`, [row, id]);
      return table.findById(id);
    },

    // Returns the number of rows changed
    async updateWhere(where, params, data) {
      await connectDB();
      const [w, p] = whereSql(where, params);
      const row = { ...toRow(data), ...(timestamps && { updatedAt: new Date() }) };
      return (await query(`UPDATE ${q(name)} SET ?${w}`, [row, ...p])).affectedRows;
    },

    // Returns the deleted row, or null
    async deleteById(id) {
      const doc = await table.findById(id);
      if (doc) await query(`DELETE FROM ${q(name)} WHERE \`id\` = ?`, [id]);
      return doc;
    },

    async deleteWhere(where, params) {
      await connectDB();
      const [w, p] = whereSql(where, params);
      return (await query(`DELETE FROM ${q(name)}${w}`, p)).affectedRows;
    },
  };
  return table;
}
