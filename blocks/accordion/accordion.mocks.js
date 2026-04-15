/**
 * Accordion Block — Mock Data
 *
 * Panel objects: { title, description }
 * Use with panelsToRows() from scripts/mockBuilder.js.
 *
 * Variations match the Figma visual reference matrix
 * (node 5:5043 light / node 5:5119 dark):
 *  - defaultPanels  (3 items — Variation 1)
 *  - faqPanels      (5 items — Variation 2)
 *  - simplePanels   (2 items — Variation 3)
 */

/** Variation 1 — 3 items (short FAQ) */
export const defaultPanels = [
  {
    title: 'How do I open an account?',
    description:
      'You can open an account online in minutes. Visit our website, click "Open an Account", and follow the step-by-step instructions. You\'ll need to provide some personal details and a form of photo ID.',
  },
  {
    title: 'What are the fees for a transaction account?',
    description:
      'Our everyday transaction account has no monthly account-keeping fees. Some fees may apply for specific services such as international transfers or paper statements — see our fees and charges schedule for full details.',
  },
  {
    title: 'How do I apply for a home loan?',
    description:
      'Start by using our online home loan calculator to get an estimate of your borrowing power. When you\'re ready, apply online or speak to a home loan specialist at your nearest branch.',
  },
];

/** Variation 2 — 5 items (full FAQ) */
export const faqPanels = [
  {
    title: 'What documents do I need to open an account?',
    description:
      'You\'ll need a valid government-issued photo ID (e.g. passport or driver\'s licence) and proof of address (e.g. a utility bill dated within the last 3 months).',
  },
  {
    title: 'Can I access my account online?',
    description:
      'Yes. Our internet banking platform is available 24/7 on desktop and via our mobile app on iOS and Android. Register in minutes using your account number and nominated email address.',
  },
  {
    title: 'Are there any monthly account fees?',
    description:
      'Most of our everyday accounts carry no monthly account-keeping fee. Premium and business accounts may include fees — refer to the relevant product disclosure statement for details.',
  },
  {
    title: 'How long does it take to process a home loan application?',
    description:
      'Conditional approval is typically provided within 1–3 business days. Full approval and settlement can take 2–6 weeks depending on the complexity of the application and property valuation.',
  },
  {
    title: 'Is my money protected?',
    description:
      'Deposits held with Great Bank are protected by the Australian Government Financial Claims Scheme (FCS) up to $250,000 per account holder.',
  },
];

/** Variation 3 — 2 items (simple FAQ) */
export const simplePanels = [
  {
    title: 'What are your customer service hours?',
    description:
      'Our contact centre is open Monday–Friday 8 am–8 pm and Saturday 9 am–5 pm AEST. In-branch hours vary by location — use our branch finder to check your nearest branch.',
  },
  {
    title: 'Do you offer business banking?',
    description:
      'Yes. We offer a full suite of business banking products including transaction accounts, business loans, merchant facilities, and payroll solutions. Visit our Business Banking hub to learn more.',
  },
];

/** Rich content panel — tests nested lists and multi-paragraph answers */
export const richContentPanels = [
  {
    title: 'What documents do I need to open an account?',
    description: 'Please bring one of the following:',
    features: ['Passport', 'Driver\'s licence', 'Medicare card (with a secondary document)'],
  },
  {
    title: 'How do I transfer money overseas?',
    description: 'International transfers can be made via:',
    steps: [
      'Log in to internet banking',
      'Select "Transfer & Pay" then "International Transfer"',
      'Enter the recipient\'s SWIFT/BIC code and IBAN',
      'Review the exchange rate and confirm',
    ],
    note: 'Transfers may take 1–5 business days depending on the destination country.',
  },
];
