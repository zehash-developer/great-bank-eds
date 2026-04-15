// Set brand for style-config; data-theme controls light/dark
document.documentElement.setAttribute('data-brand', 'wbc');
document.documentElement.setAttribute('data-mode', 'light');

// Respect user's system preference for dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.setAttribute('data-theme', 'dark');
  document.documentElement.setAttribute('data-mode', 'dark');
}

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  // Only update if no explicit mode is set by user
  if (!document.documentElement.dataset.modeUserSet) {
    const isDark = e.matches;
    document.documentElement.setAttribute('data-mode', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
});
