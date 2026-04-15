/**
 * Step Accordion Block — Mock Data
 *
 * Step items: { label, subtitle?, description, image? }
 *
 * Variations match the Figma visual reference matrix:
 *  - homeLoanSteps   (4 steps — node 28:1000 / 28:2860 light + dark)
 *  - accountSteps    (3 steps — node 28:1051)
 *  - investmentSteps (5 steps — node 28:1093, canonical dot reference)
 *  - creditCardSteps (3 steps short content — node 28:1172)
 *
 * CTA variants:
 *  - singleCTA  — single link
 *  - dualCTA    — two card links
 */

// =============================================================================
// Step item data sets
// =============================================================================

/** Variation 1 — 4 steps: Home Loan Application Process (Figma node 28:1000) */
export const homeLoanSteps = [
  {
    label: 'Get Pre-Approved',
    subtitle: 'Step 1 – 5 minutes',
    description: `
      <p>Start by getting pre-approved to understand your borrowing capacity before you begin your property search. Pre-approval gives you a realistic picture of what you can afford and shows sellers and agents you are a serious buyer.</p>
      <p>Complete our quick online form with your income, employment details, and monthly expenses. Our system will assess your application against our lending criteria and return an indicative loan amount within minutes.</p>
      <ul>
        <li>No impact on your credit score at this stage</li>
        <li>Valid for 90 days from the date of issue</li>
        <li>Covers owner-occupier and investment properties</li>
        <li>You can apply for a joint pre-approval with a co-borrower</li>
      </ul>
      <p>If your financial situation changes before settlement, let us know and we will reassess your borrowing power at no extra cost.</p>
    `,
  },
  {
    label: 'Choose Your Property',
    subtitle: 'Step 2 – Take your time',
    description: `
      <p>Once pre-approved, you can confidently search for properties within your confirmed budget. Having a pre-approval letter means you can move quickly when you find the right home, which is especially valuable in competitive markets.</p>
      <p>Use our integrated property search tools to filter listings by suburb, price range, number of bedrooms, and proximity to schools or transport. You can also save searches and receive alerts when new properties matching your criteria are listed.</p>
      <p>Before making an offer, we recommend you:</p>
      <ul>
        <li>Arrange an independent building and pest inspection</li>
        <li>Review the vendor’s disclosure statement with your solicitor</li>
        <li>Check council zoning and any development overlays</li>
        <li>Compare recent comparable sales in the area</li>
      </ul>
      <p>Our home loan specialists are available to discuss any changes to your borrowing requirements as your property search progresses.</p>
    `,
  },
  {
    label: 'Submit Full Application',
    subtitle: 'Step 3 – 15 minutes',
    description: `
      <p>When you’ve found the right property and had an offer accepted, it’s time to submit your full home loan application. This is a more detailed version of your pre-approval and includes property-specific information.</p>
      <p>You will need to provide the following documents:</p>
      <ul>
        <li>Signed contract of sale</li>
        <li>Last two payslips or most recent tax return (if self-employed)</li>
        <li>Last three months of bank statements</li>
        <li>Photo identification (driver’s licence or passport)</li>
        <li>Evidence of your deposit funds (savings account statements)</li>
      </ul>
      <p>Our lending team will conduct a formal credit assessment, order a property valuation, and issue a formal loan approval (also known as unconditional approval) within 3–5 business days for most applications.</p>
      <p>We will keep you updated at every stage via SMS and email notifications.</p>
    `,
  },
  {
    label: 'Settlement & Move In',
    subtitle: 'Step 4 – Final stage',
    description: `
      <p>After receiving your formal loan approval, your solicitor or conveyancer will coordinate with the vendor’s representative to schedule a settlement date. Settlement is the legal transfer of property ownership from the seller to you.</p>
      <p>In the days leading up to settlement:</p>
      <ul>
        <li>Complete a final inspection of the property to confirm its condition</li>
        <li>Ensure your home and contents insurance policy is active from settlement day</li>
        <li>Confirm settlement funds with your solicitor and Great Bank</li>
        <li>Arrange utility connections (electricity, gas, internet) for your move-in date</li>
      </ul>
      <p>Once settlement is complete, the title to the property is registered in your name and your mortgage officially begins. Your first repayment will be due approximately one month after settlement, depending on your repayment frequency.</p>
      <p>Welcome to your new home — our team is here to support you throughout your mortgage journey.</p>
    `,
  },
];

/** Variation 2 — 3 steps: Account Opening Journey (Figma node 28:1051) */
export const accountSteps = [
  {
    label: 'Enter Your Details',
    subtitle: 'Step 1 – 3 minutes',
    description: `
      <p>Provide your personal details to start the account opening process. All information is encrypted and protected under our Privacy Policy and the Australian Privacy Act 1988.</p>
      <p>You will need to supply:</p>
      <ul>
        <li>Full legal name (as it appears on your identity documents)</li>
        <li>Date of birth and residential address</li>
        <li>Mobile number and email address</li>
        <li>Tax File Number (TFN) — optional but recommended to avoid withholding tax on interest</li>
      </ul>
      <p>If you are opening a joint account, both applicants must complete their personal details before progressing to identity verification.</p>
    `,
  },
  {
    label: 'Verify Your Identity',
    subtitle: 'Step 2 – 2 minutes',
    description: `
      <p>Australian law requires all financial institutions to verify the identity of new customers before opening an account. This is known as Know Your Customer (KYC) compliance.</p>
      <p>You can verify your identity using any one of the following documents:</p>
      <ul>
        <li>Australian driver’s licence (front and back)</li>
        <li>Australian passport (photo page)</li>
        <li>Medicare card (combined with a secondary document)</li>
        <li>Foreign passport (if you are a non-resident or temporary visa holder)</li>
      </ul>
      <p>Our digital verification process uses secure biometric matching technology and takes around two minutes. In most cases, your identity is confirmed instantly. On rare occasions, our team may need to verify your details manually, which can take up to one business day.</p>
    `,
  },
  {
    label: 'Fund Your Account',
    subtitle: 'Step 3 – Instantly',
    description: `
      <p>Your new Great Bank account is ready to use as soon as you make your initial deposit. There is no minimum opening balance required for our everyday transaction accounts.</p>
      <p>You can fund your account in several ways:</p>
      <ul>
        <li>Instant bank transfer from another Australian financial institution via PayID or BSB/account number</li>
        <li>BPAY transfer (allow 1–2 business days)</li>
        <li>Direct deposit from your employer (provide your new BSB and account number)</li>
        <li>Cash deposit at any Great Bank branch</li>
      </ul>
      <p>Once funded, you can immediately access your account via the Great Bank app, internet banking, or your new Visa Debit card, which will arrive by mail within 5–7 business days.</p>
      <p>Set up digital wallets like Apple Pay or Google Pay from within the app for instant tap-to-pay functionality.</p>
    `,
  },
];

/** Variation 3 — 5 steps: Investment Advice Process (Figma node 28:1093, canonical dots) */
export const investmentSteps = [
  {
    label: 'Free Consultation',
    subtitle: 'Step 1 – 30 minutes',
    description: `
      <p>Your investment journey begins with a no-obligation consultation with one of our accredited financial advisers. This session is designed to be a conversation, not a sales pitch.</p>
      <p>During your consultation, we will explore:</p>
      <ul>
        <li>Your short, medium, and long-term financial goals</li>
        <li>Your current income, savings, and existing investments</li>
        <li>Your appetite for risk and how comfortable you are with market fluctuations</li>
        <li>Your investment time horizon (e.g. building wealth over 10 years vs. funding retirement in 3 years)</li>
      </ul>
      <p>Consultations are available in-branch, over the phone, or via video call at a time that suits you. Book online or call 1300 472 638 to arrange your session.</p>
    `,
  },
  {
    label: 'Financial Assessment',
    subtitle: 'Step 2 – 1 hour',
    description: `
      <p>Before recommending any investment strategy, we are required by law to conduct a thorough financial assessment. This ensures our advice is appropriate for your specific circumstances.</p>
      <p>The assessment covers:</p>
      <ul>
        <li>Net worth analysis (assets minus liabilities)</li>
        <li>Cash flow review (income streams vs. regular expenses)</li>
        <li>Tax position and potential structuring opportunities</li>
        <li>Superannuation balance and contribution history</li>
        <li>Insurance coverage and any gaps in your risk protection</li>
        <li>Estate planning considerations</li>
      </ul>
      <p>We will provide you with a Statement of Advice (SOA) that documents our findings and forms the basis for your personalised strategy. This document is yours to keep and review at any time.</p>
    `,
  },
  {
    label: 'Strategy Development',
    subtitle: 'Step 3 – We do the work',
    description: `
      <p>Based on your consultation and financial assessment, our investment team develops a personalised strategy designed to help you reach your goals while managing the level of risk you are comfortable with.</p>
      <p>Your strategy may include a combination of:</p>
      <ul>
        <li>Australian and international equities (shares)</li>
        <li>Fixed income products (bonds, term deposits)</li>
        <li>Listed investment companies (LICs) and exchange-traded funds (ETFs)</li>
        <li>Property investment structures (direct or via REITs)</li>
        <li>Alternative assets for diversification</li>
      </ul>
      <p>We use a evidence-based investment approach, drawing on decades of market research and independent data from leading research houses. Every strategy includes projected return ranges, estimated fees, and tax implications.</p>
      <p>Strategy development typically takes 3–5 business days.</p>
    `,
  },
  {
    label: 'Review & Approve',
    subtitle: 'Step 4 – 45 minutes',
    description: `
      <p>We present your personalised investment strategy in a detailed review session. This is your opportunity to ask questions, challenge assumptions, and request changes before anything is implemented.</p>
      <p>During the review session, your adviser will walk you through:</p>
      <ul>
        <li>The rationale behind each recommended investment</li>
        <li>Projected performance scenarios (conservative, moderate, and optimistic)</li>
        <li>Total fee disclosure including adviser fees, platform fees, and product fees</li>
        <li>Expected tax outcomes and any franking credit benefits</li>
        <li>How and when you can access your money if your circumstances change</li>
      </ul>
      <p>Once you are satisfied with the strategy, you provide written authority and we begin implementation immediately. You can make changes at any point before you sign.</p>
    `,
  },
  {
    label: 'Ongoing Support',
    subtitle: 'Step 5 – Continuous',
    description: `
      <p>Great Bank Wealth Management provides ongoing portfolio monitoring and proactive advice for the life of your investment relationship with us. We do not set and forget.</p>
      <p>What ongoing support includes:</p>
      <ul>
        <li>Quarterly performance reports delivered to your inbox</li>
        <li>Automatic portfolio rebalancing when allocations drift beyond agreed thresholds</li>
        <li>Annual review meetings to reassess your goals and adjust strategy if needed</li>
        <li>Tax year-end summaries to simplify your tax return</li>
        <li>Priority access to your dedicated adviser by phone and email</li>
        <li>Early notification of significant market events and how they affect your portfolio</li>
      </ul>
      <p>Life changes — whether that is a new job, a growing family, an inheritance, or approaching retirement — and your investment strategy should adapt alongside you. Your adviser is always available to talk through how major life events affect your financial plan.</p>
    `,
  },
];

/** Variation 4 — 3 steps: Credit Card Application (short content, Figma node 28:1172) */
export const creditCardSteps = [
  {
    label: 'Check Your Eligibility',
    description: `
      <p>Before applying, confirm that you meet our eligibility criteria to avoid an unnecessary credit enquiry on your file. Our eligibility checker takes less than a minute and does not affect your credit score.</p>
      <p>To be eligible for a Great Bank credit card, you must:</p>
      <ul>
        <li>Be at least 18 years old</li>
        <li>Be an Australian citizen or permanent resident</li>
        <li>Have a regular source of income (employment, self-employment, or Centrelink payments may qualify)</li>
        <li>Not be currently bankrupt or subject to a debt agreement</li>
      </ul>
      <p>Different cards have different minimum income requirements. Our Everyday card requires a minimum annual income of $25,000, while the Platinum card requires $50,000 or more.</p>
    `,
  },
  {
    label: 'Complete Your Application',
    description: `
      <p>Once you have confirmed your eligibility, the application itself is straightforward and takes approximately 10 minutes to complete online.</p>
      <p>You will be asked to provide:</p>
      <ul>
        <li>Personal information (name, address, date of birth)</li>
        <li>Employment status and employer details</li>
        <li>Gross annual income from all sources</li>
        <li>Monthly living expenses (rent or mortgage, utilities, food, transport, other debts)</li>
        <li>Your preferred credit limit (subject to assessment)</li>
      </ul>
      <p>You will not need to upload documents during the application. For most applicants, we can verify your income electronically. In some cases, we may contact you to request payslips or bank statements.</p>
    `,
  },
  {
    label: 'Get Instant Decision',
    description: `
      <p>Most applicants receive an instant decision at the end of the online application process. Our automated assessment system reviews your application and credit file in real time.</p>
      <p>Possible outcomes include:</p>
      <ul>
        <li><strong>Approved</strong> — your card will be dispatched within 5–7 business days. You can add it to your digital wallet immediately using your card details.</li>
        <li><strong>Conditionally approved</strong> — we need additional information. Our team will contact you within one business day.</li>
        <li><strong>Referred</strong> — your application requires manual review, typically completed within 2 business days.</li>
        <li><strong>Declined</strong> — you will receive a written explanation. You are entitled to request a free copy of your credit report to understand the reason.</li>
      </ul>
      <p>If approved, activate your card online or in the app when it arrives. Your credit limit and interest rate will be confirmed in your approval letter.</p>
    `,
  },
];

// =============================================================================
// CTA data
// =============================================================================

/** Single CTA */
export const singleCTA = {
  ctaType: 'single',
  singleLabel: 'Speak to a specialist',
  singleUrl: '/contact-us',
};

/** Dual CTA */
export const dualCTA = {
  ctaType: 'dual',
  dualIconOne: 'calculator-outlined',
  dualLabelOne: 'Use our borrowing calculator',
  dualDescriptionOne: 'Estimate your borrowing power in minutes',
  dualUrlOne: '/tools/borrowing-calculator',
  dualIconTwo: 'phone-outlined',
  dualLabelTwo: 'Talk to a home loan specialist',
  dualDescriptionTwo: 'Available Monday – Friday, 8 am – 6 pm',
  dualUrlTwo: '/contact-us',
};
