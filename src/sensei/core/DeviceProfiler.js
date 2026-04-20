/**
 * DeviceProfiler.js — Iteration 1
 * Fingerprints the device's hardware capabilities relevant to BGMI sensitivity.
 * No native APIs available in browser; we infer what we can from navigator,
 * screen, and a touch-sampling micro-benchmark.
 */

class DeviceProfiler {
  // ─── Profile Collection ────────────────────────────────────────────────────

  static async collect() {
    const [screenProfile, touchProfile, gyroProfile] = await Promise.all([
      DeviceProfiler._screenProfile(),
      DeviceProfiler._touchProfile(),
      DeviceProfiler._gyroProfile(),
    ]);

    return {
      // Device identity
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      deviceMemoryGB: navigator.deviceMemory ?? null, // Chrome only
      hardwareConcurrency: navigator.hardwareConcurrency ?? null,

      // Screen
      ...screenProfile,

      // Touch
      ...touchProfile,

      // Gyroscope noise floor
      ...gyroProfile,

      // Timestamps
      profiledAt: Date.now(),
    };
  }

  static _screenProfile() {
    const screen = window.screen;
    return Promise.resolve({
      screenWidthPx: screen.width,
      screenHeightPx: screen.height,
      devicePixelRatio: window.devicePixelRatio ?? 1,
      physicalWidthPx: Math.round(screen.width * (window.devicePixelRatio ?? 1)),
      physicalHeightPx: Math.round(screen.height * (window.devicePixelRatio ?? 1)),
      colorDepth: screen.colorDepth,
      // Refresh rate: estimated via rAF delta timing over 30 frames
      refreshRateHz: null, // populated by _measureRefreshRate()
    });
  }

  static _touchProfile() {
    return new Promise((resolve) => {
      resolve({
        maxTouchPoints: navigator.maxTouchPoints ?? 0,
        touchSupported: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        // Touch sampling rate: measured during calibration (MotionCalibrator)
        touchSamplingRateHz: null,
      });
    });
  }

  // Measure gyro noise floor: collect 200 still samples, compute std-dev.
  // Called only when sensor is confirmed available.
  static _gyroProfile() {
    return new Promise((resolve) => {
      if (typeof DeviceMotionEvent === 'undefined') {
        resolve({ gyroNoiseFloorAlpha: null, gyroNoiseFloorBeta: null, gyroNoiseFloorGamma: null });
        return;
      }

      const samples = { alpha: [], beta: [], gamma: [] };
      const SAMPLE_TARGET = 100;
      let count = 0;

      const handler = (event) => {
        if (!event.rotationRate) return;
        samples.alpha.push(event.rotationRate.alpha ?? 0);
        samples.beta.push(event.rotationRate.beta ?? 0);
        samples.gamma.push(event.rotationRate.gamma ?? 0);
        count++;
        if (count >= SAMPLE_TARGET) {
          window.removeEventListener('devicemotion', handler, true);
          resolve({
            gyroNoiseFloorAlpha: DeviceProfiler._stdDev(samples.alpha),
            gyroNoiseFloorBeta: DeviceProfiler._stdDev(samples.beta),
            gyroNoiseFloorGamma: DeviceProfiler._stdDev(samples.gamma),
          });
        }
      };

      window.addEventListener('devicemotion', handler, true);

      // Timeout fallback if gyro fires slowly
      setTimeout(() => {
        window.removeEventListener('devicemotion', handler, true);
        resolve({
          gyroNoiseFloorAlpha: samples.alpha.length ? DeviceProfiler._stdDev(samples.alpha) : null,
          gyroNoiseFloorBeta: samples.beta.length ? DeviceProfiler._stdDev(samples.beta) : null,
          gyroNoiseFloorGamma: samples.gamma.length ? DeviceProfiler._stdDev(samples.gamma) : null,
        });
      }, 5000);
    });
  }

  // ─── Refresh Rate Measurement ──────────────────────────────────────────────

  static measureRefreshRate() {
    return new Promise((resolve) => {
      const FRAMES = 60;
      const timestamps = [];
      let rafId;

      const tick = (ts) => {
        timestamps.push(ts);
        if (timestamps.length < FRAMES) {
          rafId = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(rafId);
          const deltas = [];
          for (let i = 1; i < timestamps.length; i++) {
            deltas.push(timestamps[i] - timestamps[i - 1]);
          }
          const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
          resolve(Math.round(1000 / avgDelta));
        }
      };
      requestAnimationFrame(tick);
    });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  static _stdDev(arr) {
    if (arr.length === 0) return 0;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((sum, v) => sum + (v - mean) ** 2, 0) / arr.length;
    return parseFloat(Math.sqrt(variance).toFixed(4));
  }

  // ─── Display ───────────────────────────────────────────────────────────────

  static summarize(profile) {
    return {
      screen: `${profile.screenWidthPx}×${profile.screenHeightPx} @ ${profile.devicePixelRatio}x DPR`,
      touch: `${profile.maxTouchPoints} touch points`,
      memory: profile.deviceMemoryGB ? `${profile.deviceMemoryGB} GB RAM` : 'Unknown RAM',
      gyroNoise: profile.gyroNoiseFloorAlpha != null
        ? `α=${profile.gyroNoiseFloorAlpha} β=${profile.gyroNoiseFloorBeta} γ=${profile.gyroNoiseFloorGamma}`
        : 'No gyro',
    };
  }
}

export default DeviceProfiler;
