// Click any [data-lightbox] element to open its full-size image in an overlay.
(function () {
    'use strict';

    let overlay, imgEl, captionEl, lastFocused;

    function ensureOverlay() {
        if (overlay) return overlay;

        overlay = document.createElement('div');
        overlay.className = 'lightbox';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Image preview');
        overlay.innerHTML =
            '<button class="lightbox__close" type="button" aria-label="Close preview">&times;</button>' +
            '<img class="lightbox__img" alt="">' +
            '<p class="lightbox__caption"></p>';

        imgEl = overlay.querySelector('.lightbox__img');
        captionEl = overlay.querySelector('.lightbox__caption');

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.closest('.lightbox__close')) close();
        });

        document.body.appendChild(overlay);
        return overlay;
    }

    function open(src, caption, alt) {
        ensureOverlay();
        lastFocused = document.activeElement;
        imgEl.src = src;
        imgEl.alt = alt || caption || 'Preview image';
        captionEl.textContent = caption || '';
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        overlay.querySelector('.lightbox__close').focus();
    }

    function close() {
        if (!overlay) return;
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
        imgEl.src = '';
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    function activate(trigger) {
        const src = trigger.getAttribute('data-lightbox');
        if (!src) return;
        const innerImg = trigger.querySelector('img');
        open(src, trigger.getAttribute('data-caption') || '', innerImg ? innerImg.alt : '');
    }

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-lightbox]');
        if (trigger) {
            e.preventDefault();
            activate(trigger);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            close();
        } else if (e.key === 'Enter' || e.key === ' ') {
            const trigger = e.target.closest && e.target.closest('[data-lightbox][tabindex]');
            if (trigger) {
                e.preventDefault();
                activate(trigger);
            }
        }
    });
})();
