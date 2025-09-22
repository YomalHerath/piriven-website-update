document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.app-search input[type="search"], .app-search input[type="text"]');
  if (!searchInput) return;

  searchInput.placeholder = 'Search';
  searchInput.setAttribute('aria-label', 'Search');
  searchInput.setAttribute('title', 'Search');
});
