import { TbLayoutDashboard } from 'react-icons/tb';
import { FaGlobe, FaCog, FaSignInAlt, FaHistory, FaBoxOpen, FaNewspaper, FaUsers, FaEnvelope, FaHandshake, FaSitemap, FaImages } from 'react-icons/fa';

// Public site navigation (Navbar + Footer)
export const mainNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Expertise', href: '/expertise' },
  { label: 'Clients', href: '/clients' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

// Footer "Explore" column (main menu + pages that aren't in the header)
export const exploreNav = [...mainNav, { label: 'FAQ', href: '/faq' }];

export const legalNav = [
  { label: 'Terms of Use', href: '/legal/termsofuse' },
  { label: 'Privacy Policy', href: '/legal/appprivacypolicy' },
  { label: 'Cookie Policy', href: '/legal/cookiepolicy' },
  { label: 'Refund Policy', href: '/legal/refundpolicy' },
];

// Admin dashboard sidebar
export const dashboardNav = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: TbLayoutDashboard },
      { label: 'Traffic Analytics', href: '/dashboard/traffic', icon: FaGlobe },
      { label: 'Messages', href: '/dashboard/messages', icon: FaEnvelope },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Products', href: '/dashboard/products', icon: FaBoxOpen },
      { label: 'Product Categories', href: '/dashboard/product-categories', icon: FaSitemap },
      { label: 'Blog Posts', href: '/dashboard/blog', icon: FaNewspaper },
      { label: 'Team', href: '/dashboard/team', icon: FaUsers },
      { label: 'Clients', href: '/dashboard/clients', icon: FaHandshake },
      { label: 'Media Library', href: '/dashboard/media', icon: FaImages },
    ],
  },
  {
    title: 'Security',
    items: [
      { label: 'Login History', href: '/dashboard/login-history', icon: FaSignInAlt },
      { label: 'User Activity', href: '/dashboard/activity', icon: FaHistory },
    ],
  },
  {
    title: 'System',
    items: [{ label: 'Settings', href: '/dashboard/settings', icon: FaCog }],
  },
];

// Routes where the public Navbar/Footer are hidden
export const appOnlyRoutes = ['/dashboard', '/admin'];
