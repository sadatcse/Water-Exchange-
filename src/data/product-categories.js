// Product category tree. Categories live in MongoDB (Dashboard → Product Categories); `seedCategories`
// is the starter tree loaded by `npm run seed`. A category is { name, slug, parent (parent slug or ''),
// icon (top-level groups only), description, order }. Safe to import in client components.
import { createElement } from 'react';
import {
  FaIndustry, FaWind, FaTachometerAlt, FaFaucet, FaVial, FaCogs, FaTint, FaFlask, FaFilter, FaBolt, FaThermometerHalf, FaRecycle,
} from 'react-icons/fa';

// Icons a top-level group can use (stored by key)
export const CATEGORY_ICONS = {
  plant: { icon: FaIndustry, label: 'Treatment plant' },
  aeration: { icon: FaWind, label: 'Aeration / air' },
  flow: { icon: FaTachometerAlt, label: 'Flow meter' },
  pump: { icon: FaFaucet, label: 'Pump' },
  instrument: { icon: FaVial, label: 'Instrument' },
  water: { icon: FaTint, label: 'Water' },
  chemical: { icon: FaFlask, label: 'Chemical' },
  filter: { icon: FaFilter, label: 'Filter' },
  power: { icon: FaBolt, label: 'Power' },
  temperature: { icon: FaThermometerHalf, label: 'Temperature' },
  recycle: { icon: FaRecycle, label: 'Recycling' },
  other: { icon: FaCogs, label: 'Other' },
};
// <CategoryIcon name="flow" className="…" /> — the group's icon (falls back to "other")
export function CategoryIcon({ name, ...props }) {
  return createElement((CATEGORY_ICONS[name] || CATEGORY_ICONS.other).icon, { 'aria-hidden': true, ...props });
}

// ---------- tree helpers (work on the flat list from the database) ----------

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name);

export const childrenOf = (list, parent = '') => list.filter((c) => (c.parent || '') === parent).sort(byOrder);

// The category and everything below it → slugs
export function descendantSlugs(list, slug) {
  const out = [slug];
  for (let i = 0; i < out.length; i++) for (const c of list) if (c.parent === out[i]) out.push(c.slug);
  return out;
}

// Top-level group → … → the category itself
export function pathTo(list, slug) {
  const path = [];
  let current = list.find((c) => c.slug === slug);
  while (current && path.length < 10) {
    path.unshift(current);
    current = current.parent ? list.find((c) => c.slug === current.parent) : null;
  }
  return path;
}

export const rootOf = (list, slug) => pathTo(list, slug)[0];

// Depth-first list with depth — for indented <select> options and the dashboard tree
export function flattenTree(list, parent = '', depth = 0) {
  return childrenOf(list, parent).flatMap((c) => [{ ...c, depth }, ...flattenTree(list, c.slug, depth + 1)]);
}

// <select> options: "Aeration Devices", "— Air Blower", "— — Roots Blower" …
export const categoryOptions = (list) => flattenTree(list).map((c) => ({ value: c.slug, label: `${'— '.repeat(c.depth)}${c.name}` }));

// Display info for one product's category: name, group name/slug, icon key
export function categoryInfo(list, slug) {
  const path = pathTo(list, slug);
  const self = path[path.length - 1];
  const root = path[0];
  return self ? { slug: self.slug, name: self.name, groupSlug: root.slug, groupName: root.name, icon: root.icon || 'other', path: path.map(({ name, slug: s }) => ({ name, slug: s })) } : null;
}

// ---------- starter tree ----------

// [name, children?] — slugs are made from the names; icons only on the groups
const TREE = [
  ['Water & Wastewater Treatment Plant', 'plant', 'Complete plants designed, built and commissioned by our engineers.', [
    ['Wastewater Recycle Plant (ZLD)'], ['Effluent Treatment Plant'], ['Sewage Treatment Plant'], ['Water Treatment Plant'],
  ]],
  ['Aeration Devices', 'aeration', 'Air supply and diffusers for biological tanks.', [
    ['Air Blower', [['Roots Blower'], ['High Efficiency Blower'], ['Turbo Blower'], ['Screw Blower']]],
    ['Turbo Compressor'],
    ['Air Diffuser', [['Coarse Bubble Disc Type'], ['Fine Bubble Disc Type'], ['Fine Bubble Tube Type']]],
  ]],
  ['Flow Measurement Solution', 'flow', 'Water, steam, gas, fuel and open channel flow measurement.', [
    ['Electromagnetic Flow Meter'], ['Vortex Flow Meter'],
    ['Ultrasonic Flow Meter', [['Open Channel Flow Meter'], ['Transit Time Flow Meter'], ['Doppler Flow Meter']]],
    ['Thermal Flow Meter'], ['Oval Gear Flow Meter'], ['Gear Flow Meter'], ['Liquid Turbine Flow Meter'],
    ['Positive Displacement Flow Meter'], ['Coriolis Flow Meter'], ['Differential Pressure Flow Meter'],
  ]],
  ['Chemical Dosing Pump', 'chemical', 'Precise metering of coagulants, acids, alkalis, polymers and disinfectants.', [
    ['Solenoid Drive Dosing Pump'], ['Small Motor Drive Dosing Pump'], ['Standard Motor Drive Dosing Pump'],
  ]],
  ['Instruments', 'instrument', 'Online monitoring, laboratory and process instruments.', [
    ['Online Analyzer'], ['Lab Equipment'], ['Level Meter'], ['Flow Indicator'], ['Pressure Transmitter'], ['Temp Sensor'], ['Process Automation & Monitoring'],
  ]],
  ['Others', 'other', 'Sludge handling, pumps, mixers, chemicals and more.', [
    ['Sludge Dewatering System', [['Filter Press'], ['Screw Press']]],
    ['Fluid Transfer Pump', [['Drum & Container Pump'], ['Air Operated Diaphragm Pump'], ['Centrifugal Pump'], ['Submersible Pump']]],
    ['Cross Correlation Flow Meter'], ['Mixing Agitator'], ['Water Treatment Chemical'], ['Cooling Tower'], ['Incinerator'],
  ]],
];

const slug = (name) => name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function expand(items, parent) {
  return items.flatMap(([name, children = []], order) => [{ name, slug: slug(name), parent, icon: '', description: '', order }, ...expand(children, slug(name))]);
}

export const seedCategories = TREE.flatMap(([name, icon, description, children], order) => [
  { name, slug: slug(name), parent: '', icon, description, order },
  ...expand(children, slug(name)),
]);
