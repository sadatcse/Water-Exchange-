// Products seeded before the category tree existed used four broad ids. `npm run seed` moves them
// to the matching category in the tree (only products still on an old id are touched).
export const legacyCategoryMoves = {
  'roots-air-blower': 'roots-blower',
  'turbo-blower': 'turbo-blower',
  'air-diffuser': 'air-diffuser',
  'submersible-sewage-pump': 'submersible-pump',
  'chemical-dosing-pump': 'chemical-dosing-pump',
  'online-analyzer': 'online-analyzer',
  'open-channel-flow-meter': 'open-channel-flow-meter',
  'vortex-flow-meter': 'vortex-flow-meter',
  'thermal-gas-flow-meter': 'thermal-flow-meter',
  'turbine-gas-flow-meter': 'flow-measurement-solution',
  'oval-gear-flow-meter': 'oval-gear-flow-meter',
  'electromagnetic-flow-meter': 'electromagnetic-flow-meter'
};

export const LEGACY_CATEGORY_IDS = ['aeration', 'pumps', 'flow-meters', 'analyzers'];
