// Central place for the site identity. Edit here — every page reads from this file.
export const siteConfig = {
  name: 'Water Exchange',
  shortName: 'Water Exchange',
  tagline: 'Water & Beyond.',
  // Used in the browser-tab / search-result title of the home page and in link previews
  slogan: 'Water & Beyond',
  description:
    'A high-end environment consultancy firm in Bangladesh — ETP, STP and WTP design and installation, plus Department of Environment (DOE) water testing and clearance, from start to finish.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.waterexchangebd.com',
  founder: {
    name: 'Engr. Sarnaly Afroz',
    title: 'Founder and Consultant',
    credentials: 'BSc Engineer (Civil) · Civil & Environment',
  },
  contact: {
    email: 'team.waterexchange@gmail.com',
    phones: ['+880 1338-950649'],
    address: 'House# 396 (4th Floor), Road# 29, New DOHS Mohakhali, Dhaka 1212',
    // Optional Google Maps link ("Open in Maps") and embed URL (map on /contact). Leave empty to hide.
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=House+396+Road+29+New+DOHS+Mohakhali+Dhaka+1212',
    mapEmbed: 'https://www.google.com/maps?q=House+396,+Road+29,+New+DOHS+Mohakhali,+Dhaka+1212&output=embed',
  },
  social: {
    facebook: '',
    linkedin: '',
    github: '',
    youtube: '',
  },
};
