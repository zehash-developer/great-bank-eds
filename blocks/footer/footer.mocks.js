/**
 * Footer Block — Mock Data
 *
 * Provides the authored table row structure that EDS generates from
 * document authoring. Import into footer.stories.js.
 *
 * Row layout (to be passed as `rows` to createMockBlock):
 *   Row 0: 1-cell [img]   → Logo
 *   Row 1: 1-cell [text]  → Tagline
 *   Row 2: 1-cell [links] → Social links
 *   Row 3: 3-cell         → Nav columns (Products | Support | About)
 *   Row 4: 1-cell [links] → Legal links
 *   Row 5: 1-cell [text]  → Copyright
 *
 * Figma reference: node 4:2395 (light), 5:4263 (dark)
 */

/** Logo cell HTML — Great Bank logo image */
export const logoHTML = `<p><img src="/great-bank-logo.svg" alt="Great Bank" width="140" height="32"></p>`;

/** Tagline cell HTML */
export const taglineHTML = `<p>Australia's trusted banking partner for over 100 years. Helping you achieve your financial goals with confidence.</p>`;

/** Social links cell HTML — one link per paragraph, text drives icon mapping */
export const socialLinksHTML = `
  <p><a href="https://www.facebook.com/greatbank" aria-label="Follow us on Facebook">Facebook</a></p>
  <p><a href="https://www.twitter.com/greatbank" aria-label="Follow us on Twitter">Twitter</a></p>
  <p><a href="https://www.instagram.com/greatbank" aria-label="Follow us on Instagram">Instagram</a></p>
  <p><a href="https://www.linkedin.com/company/greatbank" aria-label="Follow us on LinkedIn">LinkedIn</a></p>
  <p><a href="https://www.youtube.com/greatbank" aria-label="Follow us on YouTube">YouTube</a></p>
`;

/** Products nav column cell HTML */
export const productsNavHTML = `
  <p>Products</p>
  <p><a href="/personal/accounts/transaction">Transaction Accounts</a></p>
  <p><a href="/personal/accounts/savings">Savings Accounts</a></p>
  <p><a href="/personal/home-loans">Home Loans</a></p>
  <p><a href="/personal/cards/credit">Credit Cards</a></p>
  <p><a href="/personal/loans/personal">Personal Loans</a></p>
  <p><a href="/personal/insurance">Insurance</a></p>
`;

/** Support nav column cell HTML */
export const supportNavHTML = `
  <p>Support</p>
  <p><a href="/support/help-centre">Help Centre</a></p>
  <p><a href="/support/contact">Contact Us</a></p>
  <p><a href="/support/branches">Find a Branch</a></p>
  <p><a href="/support/security">Security Centre</a></p>
  <p><a href="/support/complaints">Complaints</a></p>
  <p><a href="/support/faqs">FAQs</a></p>
`;

/** About nav column cell HTML */
export const aboutNavHTML = `
  <p>About</p>
  <p><a href="/about/about-us">About Us</a></p>
  <p><a href="/about/careers">Careers</a></p>
  <p><a href="/about/media">Media Centre</a></p>
  <p><a href="/about/investor-relations">Investor Relations</a></p>
  <p><a href="/about/sustainability">Sustainability</a></p>
  <p><a href="/about/community">Community</a></p>
`;

/** Legal links cell HTML */
export const legalLinksHTML = `
  <p><a href="/legal/privacy">Privacy Policy</a></p>
  <p><a href="/legal/terms">Terms of Use</a></p>
  <p><a href="/accessibility">Accessibility</a></p>
  <p><a href="/legal">Legal</a></p>
`;

/** Copyright cell HTML */
export const copyrightHTML = `<p>© ${new Date().getFullYear()} Great Bank. All rights reserved.</p>`;

/**
 * Full set of rows for the default (light) footer.
 * Pass to createMockBlock('footer', defaultRows).
 */
export const defaultRows = [
  [logoHTML],
  [taglineHTML],
  [socialLinksHTML],
  [productsNavHTML, supportNavHTML, aboutNavHTML],
  [legalLinksHTML],
  [copyrightHTML],
];
