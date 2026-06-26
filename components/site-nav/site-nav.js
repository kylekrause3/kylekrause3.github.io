// Builds the shared nav and drops it into #site-nav-root. No fetch, so it
// works from file:// too. Edit NAV_LINKS to change the menu.
(function () {
    'use strict';

    const NAV_LINKS = [
        { href: 'index.html', label: 'Home' },
        { href: 'about.html', label: 'About' },
        { href: 'games.html', label: 'Games' },
        { href: 'art.html', label: '3D Art' },
        { href: 'audio.html', label: 'Audio' },
        { href: 'code.html', label: 'Code' }
    ];

    const CTA = { href: 'about.html#resume', label: 'Resume' };

    function currentPage() {
        const path = window.location.pathname.split('/').pop();
        return path && path.length ? path : 'index.html';
    }

    function buildNav() {
        const page = currentPage();

        const nav = document.createElement('nav');
        nav.className = 'site-nav';
        nav.setAttribute('aria-label', 'Primary');

        const inner = document.createElement('div');
        inner.className = 'site-nav__inner';

        const brand = document.createElement('a');
        brand.className = 'site-nav__brand';
        brand.href = 'index.html';
        brand.innerHTML = '<span>Kyle Krause</span>';

        const toggle = document.createElement('button');
        toggle.className = 'site-nav__toggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-label', 'Toggle navigation menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<span class="site-nav__toggle-bar" aria-hidden="true"></span>';

        const list = document.createElement('ul');
        list.className = 'site-nav__links';

        NAV_LINKS.forEach((item) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'site-nav__link';
            a.href = item.href;
            a.textContent = item.label;
            if (item.href === page) {
                a.classList.add('is-active');
                a.setAttribute('aria-current', 'page');
            }
            li.appendChild(a);
            list.appendChild(li);
        });

        const ctaItem = document.createElement('li');
        const cta = document.createElement('a');
        cta.className = 'site-nav__cta';
        cta.href = CTA.href;
        cta.textContent = CTA.label;
        ctaItem.appendChild(cta);
        list.appendChild(ctaItem);

        inner.appendChild(brand);
        inner.appendChild(list);
        inner.appendChild(toggle);
        nav.appendChild(inner);

        toggle.addEventListener('click', () => {
            const open = list.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(open));
        });

        list.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                list.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        return nav;
    }

    function mount() {
        const root = document.getElementById('site-nav-root');
        if (root) root.replaceChildren(buildNav());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
