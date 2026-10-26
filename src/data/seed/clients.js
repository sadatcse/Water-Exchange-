// Starter client logos loaded by `npm run seed` (only when the clients collection is empty).
// After seeding, clients are edited from Dashboard → Clients. Logos live in public/images/clients.
export const seedClients = [
  { name: 'Eurotex Knitwear Limited', logo: '/images/clients/eurotex.webp', sector: 'Garments' },
  { name: 'Farazy Hospital Ltd.', logo: '/images/clients/farazy-hospital.webp', sector: 'Healthcare' },
  { name: 'Dishang Sweater Ltd.', logo: '/images/clients/dishang-sweater.webp', sector: 'Garments' },
  { name: 'Fuji Knitwears Ltd.', logo: '/images/clients/fuji-knitwears.webp', sector: 'Garments' },
  { name: 'Meditex Industries Ltd.', logo: '/images/clients/meditex.webp', sector: 'Textiles' },
  { name: 'Fab-con Textile Mills Ltd.', logo: '/images/clients/fab-con.webp', sector: 'Textiles' },
  { name: 'York Group', logo: '/images/clients/york-group.webp', sector: 'Industry' },
  { name: 'Petrochem Group', logo: '/images/clients/petrochem.webp', sector: 'Industry' },
  { name: 'URO Group', logo: '/images/clients/uro-group.webp', sector: 'Industry' },
  { name: 'Techno Plastic Solution Pvt. Ltd.', logo: '/images/clients/techno-plastic.webp', sector: 'Plastics' },
  { name: '', logo: '/images/clients/twp.webp', sector: 'Industry' },
].map((c, i) => ({ ...c, order: i }));
