/**
 * Storybook Stories for Block Header Component
 *
 * Demonstrates all possible combinations and variations of the block header
 * Used across multiple blocks: accordion, action-card, cards, feature-list, tab-tiles
 */

import * as mocks from './block-header.mocks.js';

export default {
  title: 'Components/Block Header',
  parameters: {
    docs: {
      description: {
        component: `
# Block Header Component

A reusable header pattern for EDS blocks with optional heading, supporting link, and info text.

## Features
- Standard heading with customizable levels (h1-h6)
- Optional hidden heading (screen reader accessible)
- Optional supporting link with animated arrow icon
- Optional info/description text
- Light and dark mode support
- Flexible layout using flexbox

## Class Structure
- \`.block-header\` - Container (flexbox)
- \`.block-heading\` - Heading element
- \`.block-supporting-link\` - Optional link
- \`.block-info-text\` - Optional description

## Usage
Generated via \`renderBlockHeader()\` function in \`scripts/utility/shared.js\`
        `,
      },
    },
  },
};

/**
 * Simple Heading Only
 */
export const SimpleHeading = () => mocks.createBlockHeader(mocks.simpleHeading);

SimpleHeading.parameters = {
  docs: {
    description: {
      story: 'Basic heading without any additional elements. Most minimal use case.',
    },
  },
};

/**
 * Heading with Supporting Link
 */
export const HeadingWithLink = () => mocks.createBlockHeader(mocks.headingWithLink);

HeadingWithLink.parameters = {
  docs: {
    description: {
      story: 'Heading with a supporting link on the right. Link includes animated arrow icon. Used in action-card and accordion blocks.',
    },
  },
};

/**
 * Heading with Info Text
 */
export const HeadingWithInfo = () => mocks.createBlockHeader(mocks.headingWithInfo);

HeadingWithInfo.parameters = {
  docs: {
    description: {
      story: 'Heading with descriptive info text below. Info text spans full width. Used in cards block.',
    },
  },
};

/**
 * Heading with Link and Info Text
 */
export const HeadingWithLinkAndInfo = () => mocks.createBlockHeader(mocks.headingWithLinkAndInfo);

HeadingWithLinkAndInfo.parameters = {
  docs: {
    description: {
      story: 'Complete example with heading, supporting link, and info text. Info text appears on a new line below.',
    },
  },
};

/**
 * Hidden Heading
 */
export const HiddenHeading = () => mocks.createBlockHeader(mocks.hiddenHeading);

HiddenHeading.parameters = {
  docs: {
    description: {
      story: 'Heading is visually hidden but remains accessible to screen readers via aria-label. Useful for maintaining semantic structure without visual clutter.',
    },
  },
};

/**
 * Hidden Heading with Link
 */
export const HiddenHeadingWithLink = () => mocks.createBlockHeader(mocks.hiddenHeadingWithLink);

HiddenHeadingWithLink.parameters = {
  docs: {
    description: {
      story: 'Hidden heading with supporting link visible. Only the link appears visually.',
    },
  },
};

/**
 * Long Text Content
 */
export const LongContent = () => mocks.createBlockHeader(mocks.longHeading);

LongContent.parameters = {
  docs: {
    description: {
      story: 'Demonstrates behavior with long heading and info text. Container uses flex-wrap to handle overflow.',
    },
  },
};

/**
 * Custom Class Applied
 */
export const CustomClass = () => mocks.createBlockHeader(mocks.customClass);

CustomClass.parameters = {
  docs: {
    description: {
      story: 'Example with custom CSS class applied to the container for block-specific styling.',
    },
  },
};

/**
 * Different Heading Level
 */
export const H3Heading = () => mocks.createBlockHeader(mocks.h3Heading);

H3Heading.parameters = {
  docs: {
    description: {
      story: 'Using H3 instead of default H2 for semantic hierarchy. Styling remains consistent.',
    },
  },
};

/**
 * Minimal Content
 */
export const Minimal = () => mocks.createBlockHeader(mocks.minimalContent);

Minimal.parameters = {
  docs: {
    description: {
      story: 'Shortest possible heading text.',
    },
  },
};

/**
 * With Emoji
 */
export const WithEmoji = () => mocks.createBlockHeader(mocks.emojiHeading);

WithEmoji.parameters = {
  docs: {
    description: {
      story: 'Heading with emoji character. Tests unicode handling and alignment.',
    },
  },
};

/**
 * Dark Mode - Simple Heading
 */
export const DarkSimple = () => mocks.createBlockHeader(mocks.simpleHeading, { dark: true });

DarkSimple.parameters = {
  docs: {
    description: {
      story: 'Simple heading in dark mode. Colors automatically adjust via GEL tokens.',
    },
  },
};

/**
 * Dark Mode - With Link
 */
export const DarkWithLink = () => mocks.createBlockHeader(mocks.headingWithLink, { dark: true });

DarkWithLink.parameters = {
  docs: {
    description: {
      story: 'Heading with supporting link in dark mode. Link color and hover states adjust for dark background.',
    },
  },
};

/**
 * Dark Mode - With Info Text
 */
export const DarkWithInfo = () => mocks.createBlockHeader(mocks.headingWithInfo, { dark: true });

DarkWithInfo.parameters = {
  docs: {
    description: {
      story: 'Heading with info text in dark mode. Text remains readable with adjusted colors.',
    },
  },
};

/**
 * Dark Mode - Complete
 */
export const DarkComplete = () => mocks.createBlockHeader(mocks.headingWithLinkAndInfo, { dark: true });

DarkComplete.parameters = {
  docs: {
    description: {
      story: 'Full example with all elements in dark mode.',
    },
  },
};

/**
 * Comparison - Light vs Dark
 */
export const Comparison = () => {
  const container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gridTemplateColumns = '1fr 1fr';
  container.style.gap = '2rem';

  const lightHeader = mocks.createBlockHeader(mocks.headingWithLinkAndInfo, { dark: false });
  const darkHeader = mocks.createBlockHeader(mocks.headingWithLinkAndInfo, { dark: true });

  const lightLabel = document.createElement('h3');
  lightLabel.textContent = 'Light Mode';
  lightLabel.style.marginTop = '0';

  const darkLabel = document.createElement('h3');
  darkLabel.textContent = 'Dark Mode';
  darkLabel.style.marginTop = '0';

  const leftCol = document.createElement('div');
  leftCol.appendChild(lightLabel);
  leftCol.appendChild(lightHeader);

  const rightCol = document.createElement('div');
  rightCol.appendChild(darkLabel);
  rightCol.appendChild(darkHeader);

  container.appendChild(leftCol);
  container.appendChild(rightCol);

  return container;
};

Comparison.parameters = {
  docs: {
    description: {
      story: 'Side-by-side comparison of light and dark mode styling.',
    },
  },
};

/**
 * Interactive Demo
 */
export const InteractiveDemo = () => {
  const container = document.createElement('div');
  container.style.padding = '2rem';

  const title = document.createElement('h3');
  title.textContent = 'Interactive Block Header Demo';
  title.style.marginBottom = '1.5rem';

  const demoContainer = document.createElement('div');
  demoContainer.id = 'demo-output';
  demoContainer.style.padding = '2rem';
  demoContainer.style.background = '#ffffff';
  demoContainer.style.border = '1px solid #dedee1';
  demoContainer.style.borderRadius = '8px';
  demoContainer.style.marginTop = '1rem';

  const instructions = document.createElement('p');
  instructions.textContent = 'Click the links below to see different header variations:';
  instructions.style.marginBottom = '1rem';

  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '0.5rem';
  buttonContainer.style.flexWrap = 'wrap';
  buttonContainer.style.marginBottom = '1rem';

  const examples = [
    { label: 'Simple', data: mocks.simpleHeading },
    { label: 'With Link', data: mocks.headingWithLink },
    { label: 'With Info', data: mocks.headingWithInfo },
    { label: 'Complete', data: mocks.headingWithLinkAndInfo },
    { label: 'Hidden', data: mocks.hiddenHeading },
  ];

  examples.forEach(({ label, data }) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.padding = '0.5rem 1rem';
    btn.style.cursor = 'pointer';
    btn.onclick = () => {
      const header = mocks.createBlockHeader(data);
      demoContainer.innerHTML = header.innerHTML;
    };
    buttonContainer.appendChild(btn);
  });

  // Set initial content
  const initialHeader = mocks.createBlockHeader(mocks.headingWithLink);
  demoContainer.innerHTML = initialHeader.innerHTML;

  container.appendChild(title);
  container.appendChild(instructions);
  container.appendChild(buttonContainer);
  container.appendChild(demoContainer);

  return container;
};

InteractiveDemo.parameters = {
  docs: {
    description: {
      story: 'Interactive demo allowing you to switch between different header configurations.',
    },
  },
};
