// Text of the /legal pages. Each document: { title, summary, lastUpdated, sections: [{ id, heading, body: [paragraph | { list: [] }] }] }.
// Inline **bold** and [links](/path) are supported. {{email}} / {{address}} come from src/config/site.js.
// This is generic placeholder text — have it reviewed for your own business before publishing.
import { siteConfig } from '@/config/site';

const NAME = siteConfig.name;
const UPDATED = '1 January 2026';

const contactSection = {
  id: 'contact',
  heading: 'Contact us',
  body: ['Questions about this policy? Email **{{email}}** or use the [contact form](/contact). Postal address: {{address}}.'],
};

export const legalDocs = {
  termsofuse: {
    title: 'Terms of Use',
    summary: `The rules for using the ${NAME} website.`,
    lastUpdated: UPDATED,
    sections: [
      {
        id: 'acceptance',
        heading: 'Acceptance of these terms',
        body: [
          `By using this website you agree to these Terms of Use and to our [Privacy Policy](/legal/appprivacypolicy). If you do not agree, please do not use the site.`,
        ],
      },
      {
        id: 'use',
        heading: 'Acceptable use',
        body: [
          'You agree not to:',
          {
            list: [
              'break the law or anyone else’s rights while using the site;',
              'try to access accounts, data or parts of the site you are not allowed to;',
              'send spam, malware or automated traffic that harms the site;',
              'copy or reuse our content without permission.',
            ],
          },
        ],
      },
      {
        id: 'content',
        heading: 'Our content',
        body: [`All text, design and code on this website belong to ${NAME} unless stated otherwise.`],
      },
      {
        id: 'liability',
        heading: 'Disclaimer',
        body: ['The website is provided “as is”. We do our best to keep it accurate and available, but we cannot guarantee that it will always be error-free or online.'],
      },
      {
        id: 'changes',
        heading: 'Changes to these terms',
        body: ['We may update these terms from time to time. The “Last updated” date at the top shows when they last changed.'],
      },
      contactSection,
    ],
  },
  appprivacypolicy: {
    title: 'Privacy Policy',
    summary: `What information ${NAME} collects and how we use it.`,
    lastUpdated: UPDATED,
    sections: [
      {
        id: 'collect',
        heading: 'Information we collect',
        body: [
          {
            list: [
              '**Contact form** — your name, email, phone number (optional) and message.',
              '**Visit statistics** — the page you opened, where you came from, your browser, IP address and approximate country.',
              '**Dashboard accounts** — for administrators only: name, email, sign-in times and devices.',
            ],
          },
        ],
      },
      {
        id: 'use',
        heading: 'How we use it',
        body: ['We use this information only to answer your messages, keep the site secure and understand how the site is used. We do not sell your data.'],
      },
      {
        id: 'retention',
        heading: 'How long we keep it',
        body: ['Sign-in and activity logs are deleted automatically after 180 days. Contact messages are kept until they are no longer needed.'],
      },
      {
        id: 'rights',
        heading: 'Your rights',
        body: ['You can ask us to see, correct or delete the information we hold about you by contacting us.'],
      },
      contactSection,
    ],
  },
  cookiepolicy: {
    title: 'Cookie Policy',
    summary: 'The cookies and browser storage this website uses.',
    lastUpdated: UPDATED,
    sections: [
      {
        id: 'what',
        heading: 'What we use',
        body: [
          {
            list: [
              '**Session cookie** ("token") — keeps administrators signed in to the dashboard. Strictly necessary.',
              '**Theme preference** — remembers light or dark mode in your browser.',
              '**Visit flag** — makes sure one visit is counted only once per browser session.',
            ],
          },
          'We do not use advertising or third-party tracking cookies.',
        ],
      },
      {
        id: 'control',
        heading: 'Controlling cookies',
        body: ['You can delete or block cookies in your browser settings. The public pages keep working; the dashboard needs the session cookie to sign in.'],
      },
      contactSection,
    ],
  },
  refundpolicy: {
    title: 'Refund Policy',
    summary: `How refunds work for payments made to ${NAME}.`,
    lastUpdated: UPDATED,
    sections: [
      {
        id: 'eligibility',
        heading: 'Eligibility',
        body: ['Describe which payments can be refunded and within how many days a request must be made.'],
      },
      {
        id: 'process',
        heading: 'How to request a refund',
        body: ['Contact us with your name, the date of payment and the transaction reference. We will reply within a few working days.'],
      },
      {
        id: 'timing',
        heading: 'Processing time',
        body: ['Approved refunds are returned to the original payment method. Describe the expected processing time here.'],
      },
      contactSection,
    ],
  },
};

// Order of the tabs on the legal pages
export const LEGAL_ORDER = ['termsofuse', 'appprivacypolicy', 'cookiepolicy', 'refundpolicy'];
