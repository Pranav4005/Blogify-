// Selectors for theme toggle buttons and icons
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');
const themeToggleDarkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
const themeToggleLightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');

// Function to set the theme and update icons
const setTheme = (isDark) => {
    if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        console.log('[theme] set to dark');
        // When dark mode is active, show the light icon (sun) to switch to light mode
        if(themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
        if(themeToggleDarkIcon) themeToggleDarkIcon.classList.add('hidden');
        if(themeToggleLightIconMobile) themeToggleLightIconMobile.classList.remove('hidden');
        if(themeToggleDarkIconMobile) themeToggleDarkIconMobile.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        console.log('[theme] set to light');
        // When light mode is active, show the dark icon (moon) to switch to dark mode
        if(themeToggleLightIcon) themeToggleLightIcon.classList.add('hidden');
        if(themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
        if(themeToggleLightIconMobile) themeToggleLightIconMobile.classList.add('hidden');
        if(themeToggleDarkIconMobile) themeToggleDarkIconMobile.classList.remove('hidden');
    }
};

// Check the initial theme on page load
const initialThemeIsDark = localStorage.getItem('theme') === 'dark' || 
                           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
setTheme(initialThemeIsDark);

// Event listener for the toggle buttons
const toggleTheme = () => {
    const willBeDark = !document.documentElement.classList.contains('dark');
    console.log('[theme] toggle clicked; willBeDark =', willBeDark);
    setTheme(willBeDark);
    console.log('[theme] html classes:', document.documentElement.className);
};

if(themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}
if(themeToggleBtnMobile) {
    themeToggleBtnMobile.addEventListener('click', toggleTheme);
}

// -----------------------------
// Articles page search handling
// -----------------------------
(() => {
    // Only run on the articles page (has .grid of cards inside main container)
    const main = document.querySelector('main.container');
    const cardsGrid = main ? main.querySelector('.grid') : null;
    if (!main || !cardsGrid) return;

    const desktopForm = document.querySelector('form.nav-search');
    const desktopInput = desktopForm ? desktopForm.querySelector('input[type="search"]') : null;

    const mobileSearch = document.querySelector('.mobile-search');
    const mobileForm = mobileSearch ? mobileSearch.querySelector('form') : null;
    const mobileInput = mobileForm ? mobileForm.querySelector('input[type="search"]') : null;

    // Build list of cards and searchable text (title + chip + excerpt)
    const cards = Array.from(cardsGrid.querySelectorAll('.card'));
    const getCardText = (card) => {
        const title = card.querySelector('.card-title')?.textContent || '';
        const chip = card.querySelector('.chip')?.textContent || '';
        const excerpt = card.querySelector('.card-body p')?.textContent || '';
        return (title + ' ' + chip + ' ' + excerpt).toLowerCase();
    };
    const cardTextMap = new Map(cards.map(c => [c, getCardText(c)]));

    // Empty state element
    let emptyState = main.querySelector('#articles-empty-state');
    if (!emptyState) {
        emptyState = document.createElement('div');
        emptyState.id = 'articles-empty-state';
        emptyState.className = 'text-center';
        emptyState.style.display = 'none';
        emptyState.innerHTML = '<p class="muted">Article doesn\'t exist</p>';
        // Insert after the grid section
        cardsGrid.parentElement?.appendChild(emptyState);
    }

    const applyFilter = (query) => {
        const q = (query || '').trim().toLowerCase();
        let visibleCount = 0;
        cards.forEach(card => {
            const text = cardTextMap.get(card) || '';
            const match = q === '' || text.includes(q);
            card.style.display = match ? '' : 'none';
            if (match) visibleCount += 1;
        });
        emptyState.style.display = visibleCount === 0 ? '' : 'none';
    };

    const wireForm = (form, input) => {
        if (!form || !input) return;
        // Submit triggers filter; prevent page reload
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            applyFilter(input.value);
        });
        // Live filtering as user types
        input.addEventListener('input', () => applyFilter(input.value));
    };

    wireForm(desktopForm, desktopInput);
    wireForm(mobileForm, mobileInput);
})();