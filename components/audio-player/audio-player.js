// Playlist player. Tracks are .audio-player__track buttons with data-src,
// data-title and optional data-tag. Tracks without data-src stay disabled.
(function () {
    'use strict';

    function fmtTime(seconds) {
        if (!isFinite(seconds) || seconds < 0) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ':' + String(s).padStart(2, '0');
    }

    function initPlayer(root) {
        const audio = new Audio();
        audio.preload = 'metadata';

        const playBtn = root.querySelector('.audio-player__play');
        const nowTitle = root.querySelector('.audio-player__now-title');
        const nowSub = root.querySelector('.audio-player__now-sub');
        const timeEl = root.querySelector('.audio-player__time');
        const progress = root.querySelector('.audio-player__progress');
        const fill = root.querySelector('.audio-player__progress-fill');
        const tracks = Array.from(root.querySelectorAll('.audio-player__track'));

        let current = -1;
        const autoAdvance = root.getAttribute('data-autoadvance') !== 'false';
        const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="#0c1024" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
        const PAUSE_ICON = '<svg viewBox="0 0 24 24" fill="#0c1024" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';

        function setPlayIcon(playing) {
            if (playBtn) playBtn.innerHTML = playing ? PAUSE_ICON : PLAY_ICON;
        }

        function loadTrack(index, autoplay) {
            const track = tracks[index];
            if (!track) return;
            const src = track.getAttribute('data-src');
            if (!src) return;

            current = index;
            tracks.forEach((t, i) => t.classList.toggle('is-active', i === index));

            audio.src = src;
            if (nowTitle) nowTitle.textContent = track.getAttribute('data-title') || 'Untitled';
            if (nowSub) nowSub.textContent = track.getAttribute('data-tag') || '';

            if (autoplay) audio.play().catch(() => setPlayIcon(false));
        }

        function togglePlay() {
            if (current === -1) {
                const first = tracks.findIndex((t) => t.getAttribute('data-src'));
                if (first !== -1) loadTrack(first, true);
                return;
            }
            if (audio.paused) audio.play().catch(() => setPlayIcon(false));
            else audio.pause();
        }

        if (playBtn) playBtn.addEventListener('click', togglePlay);

        tracks.forEach((track, index) => {
            if (!track.getAttribute('data-src')) {
                track.setAttribute('aria-disabled', 'true');
                return;
            }
            track.addEventListener('click', () => {
                if (index === current) togglePlay();
                else loadTrack(index, true);
            });
        });

        audio.addEventListener('play', () => setPlayIcon(true));
        audio.addEventListener('pause', () => setPlayIcon(false));

        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            if (fill) fill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
            if (timeEl) timeEl.textContent = fmtTime(audio.currentTime) + ' / ' + fmtTime(audio.duration);
        });

        audio.addEventListener('loadedmetadata', () => {
            if (timeEl) timeEl.textContent = '0:00 / ' + fmtTime(audio.duration);
        });

        audio.addEventListener('ended', () => {
            if (autoAdvance) {
                for (let i = current + 1; i < tracks.length; i++) {
                    if (tracks[i].getAttribute('data-src')) {
                        loadTrack(i, true);
                        return;
                    }
                }
            }
            setPlayIcon(false);
            audio.currentTime = 0;
            if (fill) fill.style.width = '0%';
        });

        if (progress) {
            progress.addEventListener('click', (e) => {
                if (!audio.duration) return;
                const rect = progress.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
            });
        }

        setPlayIcon(false);
    }

    function init() {
        document.querySelectorAll('.audio-player').forEach(initPlayer);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
