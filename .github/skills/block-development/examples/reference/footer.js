import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SECTION_CLASSES = ['footer-logo', 'footer-links', 'footer-social', 'footer-disclaimer', 'footer-ack'];

const PLATFORM_MAP = {
  facebook: 'facebook-symbol',
  twitter: 'x-symbol',
  x: 'x-symbol',
  youtube: 'you-tube-symbol',
  linkedin: 'linked-in-symbol',
  instagram: 'instagram-symbol',
};

const APP_STORE_MAP = {
  'app store': 'apple-store-black',
  'google play': 'google-store-symbol',
};

function toPlatformIconName(a) {
  const text = (a.textContent || '').trim().toLowerCase();
  if (PLATFORM_MAP[text]) return PLATFORM_MAP[text];
  try {
    const host = new URL(a.href).hostname.toLowerCase();
    if (host.includes('facebook')) return 'facebook-symbol';
    if (host.includes('twitter') || host.includes('x.com')) return 'x-symbol';
    if (host.includes('youtube')) return 'you-tube-symbol';
    if (host.includes('linkedin')) return 'linked-in-symbol';
    if (host.includes('instagram')) return 'instagram-symbol';
  } catch { /* ignore */ }
  return null;
}

function toAppStoreIconName(a) {
  const text = (a.textContent || '').trim().toLowerCase();
  if (APP_STORE_MAP[text]) return APP_STORE_MAP[text];
  try {
    const href = a.href.toLowerCase();
    if (href.includes('apps.apple.com') || href.includes('itunes.apple.com')) return 'apple-store-black';
    if (href.includes('play.google.com')) return 'google-store-symbol';
  } catch { /* ignore */ }
  return null;
}

function decorateSocialLinks(social) {
  social.querySelectorAll('a').forEach((a) => {
    // Check if it's a social platform link
    const platformIcon = toPlatformIconName(a);
    if (platformIcon) {
      const label = a.textContent.trim() || platformIcon;
      a.textContent = '';
      a.setAttribute('aria-label', label);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');

      const icon = document.createElement('i');
      icon.className = `gel-logo gel-logo-${platformIcon}`;
      icon.setAttribute('aria-hidden', 'true');
      a.append(icon);
      return;
    }

    // Check if it's an app store link
    const appStoreIcon = toAppStoreIconName(a);
    if (appStoreIcon) {
      const label = a.textContent.trim() || a.title || appStoreIcon;
      a.textContent = '';
      a.setAttribute('aria-label', label);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.classList.add('footer-app-store-link');

      const icon = document.createElement('i');
      icon.className = `gel-logo gel-logo-${appStoreIcon}`;
      icon.setAttribute('aria-hidden', 'true');
      a.append(icon);
    }
  });
}

function decorateFooterLinks(links) {
  const columnsWrapper = links.querySelector('.columns > div');
  if (!columnsWrapper) return;
  [...columnsWrapper.children].forEach((col) => {
    col.classList.add('footer-links-column');
  });
}

function decorateAcknowledgment(ack) {
  const picture = ack.querySelector('picture');
  const paragraphs = ack.querySelectorAll('p');
  if (!picture) return;

  const imgWrap = document.createElement('div');
  imgWrap.classList.add('footer-ack-image');
  imgWrap.append(picture);

  const textWrap = document.createElement('div');
  textWrap.classList.add('footer-ack-text');
  paragraphs.forEach((p) => {
    if (!p.querySelector('picture')) textWrap.append(p);
  });

  ack.textContent = '';
  ack.append(imgWrap, textWrap);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const sections = [...footer.children];
  sections.forEach((section, i) => {
    if (SECTION_CLASSES[i]) {
      section.classList.add(SECTION_CLASSES[i]);
    }
  });

  const links = footer.querySelector('.footer-links');
  if (links) decorateFooterLinks(links);

  const social = footer.querySelector('.footer-social');
  if (social) decorateSocialLinks(social);

  const ack = footer.querySelector('.footer-ack');
  if (ack) decorateAcknowledgment(ack);

  const mainCard = document.createElement('div');
  mainCard.classList.add('footer-card');
  const logo = footer.querySelector('.footer-logo');
  const linksEl = footer.querySelector('.footer-links');
  const socialEl = footer.querySelector('.footer-social');
  if (logo) mainCard.append(logo);
  if (linksEl) mainCard.append(linksEl);
  if (socialEl) mainCard.append(socialEl);

  footer.prepend(mainCard);

  block.append(footer);
}
