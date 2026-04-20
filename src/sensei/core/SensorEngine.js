/**
 * SensorEngine.js — Iteration 1
 * Captures gyroscope, accelerometer, and touch events via Web Sensor APIs.
 * Target: 100Hz sample rate (limited to ~60Hz in most browsers; we use the
 * highest available and timestamp every sample for downstream accuracy).
 *
 * iOS 13+ requires DeviceMotionEvent.requestPermission() — must be called
 * from a user-gesture handler (the "Start Calibration" button).
 */

const SAMPLE_INTERVAL_MS = 10; // target 100Hz

class SensorEngine {
  constructor() {
    this._samples = [];
    this._touchEvents = [];
    this._isRunning = false;
    this._motionHandler = null;
    this._orientationHandler = null;
    this._touchStartHandler = null;
    this._touchMoveHandler = null;
    this._intervalId = null;
    this._startTime = null;
    this._lastMotionSample = null;
  }

  // ─── Permission ────────────────────────────────────────────────────────────

  static async requestPermission() {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      // iOS 13+
      const state = await DeviceMotionEvent.requestPermission();
      if (state !== 'granted') {
        throw new Error('Motion permission denied by user.');
      }
    }
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      const state = await DeviceOrientationEvent.requestPermission();
      if (state !== 'granted') {
        throw new Error('Orientation permission denied by user.');
      }
    }
    return true;
  }

  static isSupported() {
    return typeof DeviceMotionEvent !== 'undefined';
  }

  // ─── Capture ────────────────────────────────────────────────────────────────

  start(targetElement) {
    if (this._isRunning) return;
    this._isRunning = true;
    this._startTime = performance.now();
    this._samples = [];
    this._touchEvents = [];

    // DeviceMotion: linear acceleration + rotationRate (gyro)
    this._motionHandler = (event) => {
      const ts = performance.now() - this._startTime;
      this._lastMotionSample = {
        ts: Math.round(ts),
        // Accelerometer (m/s²) — includes gravity on some platforms
        ax: event.accelerationIncludingGravity?.x ?? 0,
        ay: event.accelerationIncludingGravity?.y ?? 0,
        az: event.accelerationIncludingGravity?.z ?? 0,
        // Pure linear acceleration (gravity removed)
        lax: event.acceleration?.x ?? 0,
        lay: event.acceleration?.y ?? 0,
        laz: event.acceleration?.z ?? 0,
        // Gyroscope (deg/s)
        gyrAlpha: event.rotationRate?.alpha ?? 0,
        gyrBeta: event.rotationRate?.beta ?? 0,
        gyrGamma: event.rotationRate?.gamma ?? 0,
        interval: event.interval ?? 0,
      };
      this._samples.push(this._lastMotionSample);
    };

    // Touch events on the target element (defaults to document)
    const el = targetElement || document;
    this._touchStartHandler = (event) => {
      const ts = performance.now() - this._startTime;
      for (const touch of event.changedTouches) {
        this._touchEvents.push({
          ts: Math.round(ts),
          type: 'start',
          id: touch.identifier,
          x: touch.clientX,
          y: touch.clientY,
          force: touch.force ?? 0,
          radiusX: touch.radiusX ?? 0,
          radiusY: touch.radiusY ?? 0,
        });
      }
    };
    this._touchMoveHandler = (event) => {
      const ts = performance.now() - this._startTime;
      for (const touch of event.changedTouches) {
        this._touchEvents.push({
          ts: Math.round(ts),
          type: 'move',
          id: touch.identifier,
          x: touch.clientX,
          y: touch.clientY,
          force: touch.force ?? 0,
          radiusX: touch.radiusX ?? 0,
          radiusY: touch.radiusY ?? 0,
        });
      }
    };
    this._touchEndHandler = (event) => {
      const ts = performance.now() - this._startTime;
      for (const touch of event.changedTouches) {
        this._touchEvents.push({
          ts: Math.round(ts),
          type: 'end',
          id: touch.identifier,
          x: touch.clientX,
          y: touch.clientY,
          force: 0,
          radiusX: touch.radiusX ?? 0,
          radiusY: touch.radiusY ?? 0,
        });
      }
    };

    window.addEventListener('devicemotion', this._motionHandler, true);
    el.addEventListener('touchstart', this._touchStartHandler, { passive: true });
    el.addEventListener('touchmove', this._touchMoveHandler, { passive: true });
    el.addEventListener('touchend', this._touchEndHandler, { passive: true });
  }

  stop() {
    if (!this._isRunning) return;
    this._isRunning = false;
    window.removeEventListener('devicemotion', this._motionHandler, true);
    document.removeEventListener('touchstart', this._touchStartHandler);
    document.removeEventListener('touchmove', this._touchMoveHandler);
    document.removeEventListener('touchend', this._touchEndHandler);
  }

  // ─── Data Access ─────────────────────────────────────────────────────────────

  getSamples() {
    return [...this._samples];
  }

  getTouchEvents() {
    return [...this._touchEvents];
  }

  getSampleCount() {
    return this._samples.length;
  }

  getElapsedMs() {
    if (!this._startTime) return 0;
    return Math.round(performance.now() - this._startTime);
  }

  getActualHz() {
    const elapsed = this.getElapsedMs();
    if (elapsed === 0) return 0;
    return Math.round((this._samples.length / elapsed) * 1000);
  }

  // ─── CSV Export ──────────────────────────────────────────────────────────────

  exportMotionCSV() {
    const header = 'ts_ms,ax,ay,az,lax,lay,laz,gyr_alpha,gyr_beta,gyr_gamma,interval_ms';
    const rows = this._samples.map((s) =>
      [s.ts, s.ax, s.ay, s.az, s.lax, s.lay, s.laz,
        s.gyrAlpha, s.gyrBeta, s.gyrGamma, s.interval].join(',')
    );
    return [header, ...rows].join('\n');
  }

  exportTouchCSV() {
    const header = 'ts_ms,type,touch_id,x,y,force,radius_x,radius_y';
    const rows = this._touchEvents.map((t) =>
      [t.ts, t.type, t.id, t.x, t.y, t.force, t.radiusX, t.radiusY].join(',')
    );
    return [header, ...rows].join('\n');
  }

  exportAllCSV() {
    return {
      motion: this.exportMotionCSV(),
      touch: this.exportTouchCSV(),
    };
  }
}

export default SensorEngine;
