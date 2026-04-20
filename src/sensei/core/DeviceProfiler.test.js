import DeviceProfiler from './DeviceProfiler';

describe('DeviceProfiler', () => {
  describe('_stdDev', () => {
    test('returns 0 for empty array', () => {
      expect(DeviceProfiler._stdDev([])).toBe(0);
    });

    test('returns 0 for single-element array', () => {
      expect(DeviceProfiler._stdDev([5])).toBe(0);
    });

    test('returns 0 for all-equal values', () => {
      expect(DeviceProfiler._stdDev([3, 3, 3, 3])).toBe(0);
    });

    test('computes correct std dev for known dataset', () => {
      // [2, 4, 4, 4, 5, 5, 7, 9] → population std dev = 2.0
      const result = DeviceProfiler._stdDev([2, 4, 4, 4, 5, 5, 7, 9]);
      expect(result).toBeCloseTo(2.0, 1);
    });

    test('returns positive value for noisy data', () => {
      const noisy = [0.1, -0.3, 0.2, -0.1, 0.5, -0.4];
      expect(DeviceProfiler._stdDev(noisy)).toBeGreaterThan(0);
    });
  });

  describe('_screenProfile', () => {
    test('returns screen dimensions from window.screen', async () => {
      Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true, writable: true });
      // jsdom screen.width/height are 0 by default; test the DPR math with actual values
      const profile = await DeviceProfiler._screenProfile();
      expect(profile.devicePixelRatio).toBe(3);
      expect(typeof profile.screenWidthPx).toBe('number');
      expect(typeof profile.physicalWidthPx).toBe('number');
      expect(profile.physicalWidthPx).toBe(Math.round(profile.screenWidthPx * 3));
    });
  });

  describe('_touchProfile', () => {
    test('reflects maxTouchPoints from navigator', async () => {
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 5,
        configurable: true,
        writable: true,
      });
      const profile = await DeviceProfiler._touchProfile();
      expect(profile.maxTouchPoints).toBe(5);
      expect(profile.touchSupported).toBe(true);
    });
  });

  describe('measureRefreshRate', () => {
    test('returns a number between 30 and 240', async () => {
      // Mock requestAnimationFrame to simulate 60Hz (16.67ms per frame)
      let frameTime = 0;
      global.requestAnimationFrame = (cb) => {
        frameTime += 16.67;
        setTimeout(() => cb(frameTime), 0);
        return 1;
      };
      global.cancelAnimationFrame = jest.fn();

      const hz = await DeviceProfiler.measureRefreshRate();
      expect(hz).toBeGreaterThanOrEqual(30);
      expect(hz).toBeLessThanOrEqual(240);
    }, 10000);
  });

  describe('summarize', () => {
    test('formats a profile into human-readable strings', () => {
      const profile = {
        screenWidthPx: 1080,
        screenHeightPx: 2400,
        devicePixelRatio: 3,
        maxTouchPoints: 10,
        deviceMemoryGB: 8,
        gyroNoiseFloorAlpha: 0.05,
        gyroNoiseFloorBeta: 0.03,
        gyroNoiseFloorGamma: 0.04,
      };
      const summary = DeviceProfiler.summarize(profile);
      expect(summary.screen).toContain('1080×2400');
      expect(summary.touch).toContain('10 touch points');
      expect(summary.memory).toContain('8 GB');
      expect(summary.gyroNoise).toContain('α=0.05');
    });

    test('handles missing gyro gracefully', () => {
      const profile = {
        screenWidthPx: 360,
        screenHeightPx: 800,
        devicePixelRatio: 2,
        maxTouchPoints: 5,
        deviceMemoryGB: null,
        gyroNoiseFloorAlpha: null,
        gyroNoiseFloorBeta: null,
        gyroNoiseFloorGamma: null,
      };
      const summary = DeviceProfiler.summarize(profile);
      expect(summary.gyroNoise).toBe('No gyro');
      expect(summary.memory).toBe('Unknown RAM');
    });
  });
});

// ── Accuracy simulation: 20 synthetic device profiles ─────────────────────────
describe('DeviceProfiler — accuracy simulation (Iteration 1 baseline)', () => {
  const syntheticProfiles = Array.from({ length: 20 }, (_, i) => ({
    screenWidthPx: [360, 390, 412, 414, 393, 360, 412, 390, 393, 414,
                    360, 412, 390, 393, 414, 360, 390, 412, 393, 414][i],
    screenHeightPx: [800, 844, 915, 896, 852, 800, 915, 844, 852, 896,
                     800, 915, 844, 852, 896, 800, 844, 915, 852, 896][i],
    devicePixelRatio: [2, 3, 2.5, 3, 2, 2, 2.5, 3, 2, 3,
                       2, 2.5, 3, 2, 3, 2, 3, 2.5, 2, 3][i],
    maxTouchPoints: 5,
    deviceMemoryGB: [4, 8, 6, 8, 4, 6, 8, 4, 6, 8,
                     4, 6, 8, 4, 6, 8, 4, 6, 8, 4][i],
    gyroNoiseFloorAlpha: 0.01 * (i + 1),
    gyroNoiseFloorBeta: 0.01 * (i + 1),
    gyroNoiseFloorGamma: 0.01 * (i + 1),
  }));

  test('summarize succeeds for all 20 synthetic device profiles', () => {
    let successCount = 0;
    for (const profile of syntheticProfiles) {
      try {
        const summary = DeviceProfiler.summarize(profile);
        if (summary.screen && summary.touch) successCount++;
      } catch {}
    }
    // Iteration 1 baseline: 38% accuracy target → 100% of device summaries should work
    expect(successCount).toBe(20);
  });
});
