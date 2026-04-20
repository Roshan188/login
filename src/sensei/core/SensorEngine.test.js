import SensorEngine from './SensorEngine';

// Mock DeviceMotionEvent and browser APIs
beforeEach(() => {
  global.performance = { now: jest.fn(() => Date.now()) };

  // Mock addEventListener/removeEventListener on window
  jest.spyOn(window, 'addEventListener').mockImplementation(() => {});
  jest.spyOn(window, 'removeEventListener').mockImplementation(() => {});
  jest.spyOn(document, 'addEventListener').mockImplementation(() => {});
  jest.spyOn(document, 'removeEventListener').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('SensorEngine', () => {
  test('isSupported returns true when DeviceMotionEvent exists', () => {
    global.DeviceMotionEvent = class {};
    expect(SensorEngine.isSupported()).toBe(true);
  });

  test('isSupported returns false when DeviceMotionEvent is absent', () => {
    const orig = global.DeviceMotionEvent;
    delete global.DeviceMotionEvent;
    expect(SensorEngine.isSupported()).toBe(false);
    global.DeviceMotionEvent = orig;
  });

  test('start registers devicemotion listener', () => {
    const engine = new SensorEngine();
    engine.start();
    expect(window.addEventListener).toHaveBeenCalledWith(
      'devicemotion',
      expect.any(Function),
      true
    );
  });

  test('stop removes devicemotion listener', () => {
    const engine = new SensorEngine();
    engine.start();
    engine.stop();
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'devicemotion',
      expect.any(Function),
      true
    );
  });

  test('start/stop idempotency: double-start does not register twice', () => {
    const engine = new SensorEngine();
    engine.start();
    engine.start(); // second call should be a no-op
    const calls = window.addEventListener.mock.calls.filter(
      ([evt]) => evt === 'devicemotion'
    );
    expect(calls.length).toBe(1);
  });

  test('getSamples returns empty array before any motion events', () => {
    const engine = new SensorEngine();
    engine.start();
    expect(engine.getSamples()).toEqual([]);
  });

  test('getSampleCount returns 0 initially', () => {
    const engine = new SensorEngine();
    expect(engine.getSampleCount()).toBe(0);
  });

  test('getElapsedMs returns 0 before start', () => {
    const engine = new SensorEngine();
    expect(engine.getElapsedMs()).toBe(0);
  });

  test('exportMotionCSV returns header row when no samples', () => {
    const engine = new SensorEngine();
    const csv = engine.exportMotionCSV();
    expect(csv.startsWith('ts_ms,ax,ay,az')).toBe(true);
    expect(csv.split('\n').length).toBe(1); // header only
  });

  test('exportTouchCSV returns header row when no touch events', () => {
    const engine = new SensorEngine();
    const csv = engine.exportTouchCSV();
    expect(csv.startsWith('ts_ms,type,touch_id')).toBe(true);
    expect(csv.split('\n').length).toBe(1);
  });

  test('exportAllCSV returns both motion and touch keys', () => {
    const engine = new SensorEngine();
    const result = engine.exportAllCSV();
    expect(result).toHaveProperty('motion');
    expect(result).toHaveProperty('touch');
  });

  test('requestPermission resolves when no requestPermission method exists', async () => {
    // Desktop / Android — no permission gate
    const origDME = global.DeviceMotionEvent;
    global.DeviceMotionEvent = class {};
    // No requestPermission static method → should resolve without error
    await expect(SensorEngine.requestPermission()).resolves.toBe(true);
    global.DeviceMotionEvent = origDME;
  });

  test('requestPermission rejects when iOS denies motion', async () => {
    global.DeviceMotionEvent = class {
      static requestPermission() {
        return Promise.resolve('denied');
      }
    };
    await expect(SensorEngine.requestPermission()).rejects.toThrow(
      'Motion permission denied'
    );
  });

  test('requestPermission resolves when iOS grants motion', async () => {
    global.DeviceMotionEvent = class {
      static requestPermission() {
        return Promise.resolve('granted');
      }
    };
    global.DeviceOrientationEvent = class {};
    await expect(SensorEngine.requestPermission()).resolves.toBe(true);
  });
});

// ── Synthetic data ingestion test ─────────────────────────────────────────────
describe('SensorEngine — synthetic sample injection', () => {
  test('motion handler correctly records sample', () => {
    const engine = new SensorEngine();

    // Capture the handler registered on window
    let capturedHandler = null;
    window.addEventListener.mockImplementation((evt, handler) => {
      if (evt === 'devicemotion') capturedHandler = handler;
    });

    let callCount = 0;
    performance.now = () => {
      callCount++;
      return callCount * 10; // 10ms increments
    };

    engine.start();

    // Simulate a motion event
    const fakeEvent = {
      accelerationIncludingGravity: { x: 0.1, y: -9.8, z: 0.3 },
      acceleration: { x: 0.1, y: -0.1, z: 0.3 },
      rotationRate: { alpha: 12.5, beta: -3.2, gamma: 0.8 },
      interval: 16,
    };

    capturedHandler(fakeEvent);

    const samples = engine.getSamples();
    expect(samples.length).toBe(1);
    expect(samples[0].ay).toBeCloseTo(-9.8);
    expect(samples[0].gyrAlpha).toBeCloseTo(12.5);
    expect(samples[0].interval).toBe(16);
  });

  test('CSV row count matches injected samples', () => {
    const engine = new SensorEngine();
    let capturedHandler = null;
    window.addEventListener.mockImplementation((evt, handler) => {
      if (evt === 'devicemotion') capturedHandler = handler;
    });

    performance.now = () => 100;
    engine.start();

    const fakeEvent = {
      accelerationIncludingGravity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      rotationRate: { alpha: 0, beta: 0, gamma: 0 },
      interval: 10,
    };

    for (let i = 0; i < 20; i++) capturedHandler(fakeEvent);

    const csv = engine.exportMotionCSV();
    const lines = csv.split('\n');
    expect(lines.length).toBe(21); // 1 header + 20 data rows
  });
});
