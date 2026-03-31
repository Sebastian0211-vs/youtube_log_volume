
(function () {
  'use strict';
  const POWER = 2;

  function sliderToVolume(s) {
    if (s <= 0) return 0;
    if (s >= 100) return 100;
    return Math.pow(s / 100, POWER) * 100;
  }

  function volumeToSlider(v) {
    if (v <= 0) return 0;
    if (v >= 100) return 100;
    return Math.pow(v / 100, 1 / POWER) * 100;
  }


  let isHooked = false;

  function tryHook() {
    if (isHooked) return;

    const player = document.querySelector('#movie_player');
    const slider = document.querySelector('input.ytp-volume-slider');

    if (!player || !slider || typeof player.setVolume !== 'function') return;

    isHooked = true;
    console.log('[LogVol] Player found — hooking volume slider.');

    slider.addEventListener('input', function (e) {
      e.stopImmediatePropagation();

      const rawPos = parseFloat(slider.value);       // 0–100, linear position
      const mappedVol = sliderToVolume(rawPos);       // 0–100, log-remapped

      player.setVolume(mappedVol);

      // Handle mute transitions
      if (mappedVol === 0) {
        player.mute();
      } else if (player.isMuted()) {
        player.unMute();
      }
    }, true /* capture */);

    const volumePanel = document.querySelector('.ytp-volume-panel');
    if (volumePanel) {
      volumePanel.addEventListener('wheel', function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();

        const currentVol = player.getVolume();
        const currentSliderPos = volumeToSlider(currentVol);

        // Each scroll tick = 5 slider units
        const delta = e.deltaY < 0 ? 5 : -5;
        const newSliderPos = Math.max(0, Math.min(100, currentSliderPos + delta));
        const newVol = sliderToVolume(newSliderPos);

        player.setVolume(newVol);
        slider.value = newSliderPos;

        if (newVol === 0) {
          player.mute();
        } else if (player.isMuted()) {
          player.unMute();
        }
      }, { capture: true, passive: false });
    }
    const storedVol = player.getVolume();
    const displayPos = volumeToSlider(storedVol);
    slider.value = displayPos;

    console.log(`[LogVol] Ready. Stored volume: ${storedVol.toFixed(1)} → slider display: ${displayPos.toFixed(1)}`);
  }

  const poll = setInterval(() => {
    tryHook();
    if (isHooked) clearInterval(poll);
  }, 300);

  setTimeout(() => clearInterval(poll), 30_000); // give up after 30s

  document.addEventListener('yt-navigate-finish', () => {
    isHooked = false;
    setTimeout(tryHook, 800);
  });

})();
