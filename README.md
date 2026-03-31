# YouTube Log Volume

Fixes YouTube's volume slider to use a **logarithmic (power) curve** instead of a linear one.

## Why?

Human hearing is logarithmic. YouTube's slider is linear, which means:
- The bottom 30% of the slider controls most of the audible range
- The top 50% barely changes anything you can hear

This extension remaps the slider so that equal steps feel equal in loudness.

## What it fixes

-  Slider drag → log-remapped volume
-  Scroll wheel on volume area → log-remapped steps
-  Initial slider display position corrected on load
-  Works across YouTube SPA navigation (no full reloads needed)

## How to install (unpacked)

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select this folder

## The math

Uses a power curve with exponent 2:

```
sliderToVolume(s) = (s / 100)^2 * 100
volumeToSlider(v) = sqrt(v / 100) * 100
```

This is a well-established approximation of equal-loudness perception and gives
much better fine control at low volumes where you spend most of your time.
