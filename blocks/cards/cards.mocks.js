/**
 * Cards Block — Mock Data
 *
 * Row format per card (6 cells):
 *   [iconHTML, tagsText, title, subtitle, description, ctasHTML]
 *
 * Matches extractCardFromRow() cell mapping in cards.js.
 *
 * Variations match the Figma visual reference matrix:
 *  - node 17:6  (light mode — 3 cards: Transaction Account, Home Loans, Credit Cards)
 *  - node 22:372 (dark mode — same 3 cards)
 */

// Placeholder icon — a simple inline SVG for Storybook only.
// In production, authors provide a real image via the AEM reference picker.
const ICON_ACCOUNT = `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Crect width='18' height='14' x='3' y='5' rx='2' fill='none' stroke='%23002855' stroke-width='2'/%3E%3Cpath d='M3 9h18' stroke='%23002855' stroke-width='2'/%3E%3C/svg%3E" alt="Transaction account icon" width="24" height="24" />`;

const ICON_HOME = `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' fill='none' stroke='%23002855' stroke-width='2' stroke-linejoin='round'/%3E%3Cpolyline points='9,22 9,12 15,12 15,22' stroke='%23002855' stroke-width='2' fill='none'/%3E%3C/svg%3E" alt="Home loans icon" width="24" height="24" />`;

const ICON_CARD = `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Crect width='20' height='14' x='2' y='5' rx='2' fill='none' stroke='%23002855' stroke-width='2'/%3E%3Cpath d='M2 10h20' stroke='%23002855' stroke-width='2'/%3E%3C/svg%3E" alt="Credit card icon" width="24" height="24" />`;

// =============================================================================
// Figma light-mode cards (node 17:6)
// =============================================================================

/**
 * Three-card row — Figma light mode reference.
 * Transaction Account (2 CTAs), Home Loans (1 CTA), Credit Cards (1 CTA).
 */
export const lightCards = [
  [
    ICON_ACCOUNT,
    'Popular, No Fees',
    'Transaction Account',
    '$0 monthly fees',
    'Everyday banking made simple with no monthly fees and unlimited transactions.',
    '<a href="/accounts/transaction">Open Account</a><a href="/accounts/transaction/learn-more">Learn More</a>',
  ],
  [
    ICON_HOME,
    'Featured, Low Rate',
    'Home Loans',
    'From 5.99% p.a.',
    'Competitive rates and flexible repayment options to help you buy your dream home.',
    '<a href="/loans/home">Apply Now</a>',
  ],
  [
    ICON_CARD,
    'Rewards',
    'Credit Cards',
    'Up to 55 days interest free',
    'Enjoy rewards, insurance and interest-free days on purchases.',
    '<a href="/cards/compare">Compare Cards</a>',
  ],
];

// =============================================================================
// Figma dark-mode cards (node 22:372) — same content, dark variant applied via classList
// =============================================================================

/** Same three cards as lightCards — dark variant via block.classList.add('dark'). */
export const darkCards = lightCards;

// =============================================================================
// Single CTA — one button per card
// =============================================================================

/** All cards have exactly one CTA (no outline button). */
export const singleCtaCards = [
  [
    ICON_ACCOUNT,
    'Popular',
    'Savings Account',
    '4.75% p.a. interest',
    'Earn a competitive interest rate with no monthly fees on our everyday savings account.',
    '<a href="/accounts/savings">Open Account</a>',
  ],
  [
    ICON_HOME,
    'Fixed Rate',
    'Fixed Rate Loan',
    'From 6.29% p.a.',
    'Lock in a competitive rate for 1, 2, or 3 years for budget certainty on your home loan.',
    '<a href="/loans/fixed">Apply Now</a>',
  ],
  [
    ICON_CARD,
    '',
    'Personal Loan',
    '',
    'Flexible personal loans from $5,000 to $50,000 with no early repayment fees.',
    '<a href="/loans/personal">Apply Now</a>',
  ],
];

// =============================================================================
// Minimal — no tags, no subtitle
// =============================================================================

/** Cards with only the required fields: icon, title, description, CTA. */
export const minimalCards = [
  [
    ICON_ACCOUNT,
    '',
    'Everyday Account',
    '',
    'A simple account for day-to-day banking with no monthly fees.',
    '<a href="/accounts/everyday">Learn More</a>',
  ],
  [
    ICON_HOME,
    '',
    'Investment Loan',
    '',
    'Grow your property portfolio with a flexible investment loan.',
    '<a href="/loans/investment">Learn More</a>',
  ],
];

// =============================================================================
// Two-card layout — boundary test
// =============================================================================

/** Only two cards to verify grid layout with fewer items. */
export const twoCards = lightCards.slice(0, 2);
