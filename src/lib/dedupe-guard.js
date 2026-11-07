// Finds the same submission made within the last `windowMinutes` (stops double-clicks / spam).
// `fields` are matched exactly, e.g. { email, message }.
export async function findRecentDuplicate(table, fields, windowMinutes = 10) {
  const cols = Object.keys(fields);
  const where = [...cols.map((c) => `\`${c}\` = ?`), '`createdAt` >= ?'].join(' AND ');
  return table.findOne(where, [...Object.values(fields), new Date(Date.now() - windowMinutes * 60 * 1000)], { columns: ['createdAt'] });
}
