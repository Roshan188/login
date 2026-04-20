import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SensorEngine from '../sensei/core/SensorEngine';
import DeviceProfiler from '../sensei/core/DeviceProfiler';
import {
  setPermissionGranted,
  setSensorSupported,
  setCalibrationPhase,
  updateCalibrationProgress,
  setDeviceProfile,
  setExportedCSVUrls,
  setError,
  resetCalibration,
  selectCalibrationPhase,
  selectCalibrationProgress,
  selectDeviceProfile,
  selectExportUrls,
  selectError,
} from '../features/senseiSlice';
import './CalibrationScreen.css';

const CALIBRATION_DURATION_MS = 60000;
const PROGRESS_INTERVAL_MS = 200;

function CalibrationScreen() {
  const dispatch = useDispatch();
  const phase = useSelector(selectCalibrationPhase);
  const progress = useSelector(selectCalibrationProgress);
  const deviceProfile = useSelector(selectDeviceProfile);
  const exportUrls = useSelector(selectExportUrls);
  const errorMessage = useSelector(selectError);

  const engineRef = useRef(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const calibAreaRef = useRef(null);

  const [refreshRate, setRefreshRate] = useState(null);

  // Check sensor support on mount
  useEffect(() => {
    dispatch(setSensorSupported(SensorEngine.isSupported()));
  }, [dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
      engineRef.current?.stop();
    };
  }, []);

  const handleStart = useCallback(async () => {
    dispatch(resetCalibration());
    dispatch(setCalibrationPhase('requesting_permission'));

    try {
      await SensorEngine.requestPermission();
      dispatch(setPermissionGranted(true));
    } catch (err) {
      dispatch(setError(`Permission denied: ${err.message}`));
      return;
    }

    // Profile device before starting capture
    dispatch(setCalibrationPhase('running'));
    const engine = new SensorEngine();
    engineRef.current = engine;
    engine.start(calibAreaRef.current);

    // Measure refresh rate concurrently
    DeviceProfiler.measureRefreshRate().then((hz) => setRefreshRate(hz));

    // Profile device hardware
    DeviceProfiler.collect().then((profile) => {
      dispatch(setDeviceProfile(profile));
    });

    // Progress ticker
    progressRef.current = setInterval(() => {
      dispatch(updateCalibrationProgress({
        elapsedMs: engine.getElapsedMs(),
        sampleCount: engine.getSampleCount(),
        actualHz: engine.getActualHz(),
      }));
    }, PROGRESS_INTERVAL_MS);

    // Auto-stop after 60s
    timerRef.current = setTimeout(() => {
      handleStop(engine);
    }, CALIBRATION_DURATION_MS);
  }, [dispatch]);

  const handleStop = useCallback((engine) => {
    const eng = engine || engineRef.current;
    if (!eng) return;

    eng.stop();
    clearInterval(progressRef.current);
    clearTimeout(timerRef.current);

    const { motion, touch } = eng.exportAllCSV();

    const motionBlob = new Blob([motion], { type: 'text/csv' });
    const touchBlob = new Blob([touch], { type: 'text/csv' });
    const motionCSVUrl = URL.createObjectURL(motionBlob);
    const touchCSVUrl = URL.createObjectURL(touchBlob);

    dispatch(setExportedCSVUrls({ motionCSVUrl, touchCSVUrl }));
    dispatch(updateCalibrationProgress({
      elapsedMs: eng.getElapsedMs(),
      sampleCount: eng.getSampleCount(),
      actualHz: eng.getActualHz(),
    }));
    dispatch(setCalibrationPhase('completed'));
  }, [dispatch]);

  const handleReset = useCallback(() => {
    engineRef.current?.stop();
    clearInterval(progressRef.current);
    clearTimeout(timerRef.current);
    if (exportUrls.motionCSVUrl) URL.revokeObjectURL(exportUrls.motionCSVUrl);
    if (exportUrls.touchCSVUrl) URL.revokeObjectURL(exportUrls.touchCSVUrl);
    dispatch(resetCalibration());
    setRefreshRate(null);
  }, [dispatch, exportUrls]);

  const progressPercent = Math.min(
    100,
    Math.round((progress.elapsedMs / progress.durationMs) * 100)
  );

  return (
    <div className="calibration-screen" ref={calibAreaRef}>
      <header className="calib-header">
        <h1 className="sensei-title">SENSEI</h1>
        <p className="sensei-tagline">BGMI Sensitivity Calibrator</p>
      </header>

      <main className="calib-body">
        {/* ── IDLE ── */}
        {phase === 'idle' && (
          <section className="calib-card">
            <div className="calib-icon">🎮</div>
            <h2>Motion Calibration</h2>
            <p className="calib-description">
              Hold your device naturally. Sensei will record 60 seconds of motion
              and touch data to build your personal BGMI sensitivity profile.
            </p>
            <ul className="calib-tips">
              <li>Keep the device steady for the first 5 seconds</li>
              <li>Then move naturally as you would while gaming</li>
              <li>Tap the screen area during capture for touch data</li>
            </ul>
            <button className="btn-primary" onClick={handleStart}>
              Start Calibration
            </button>
          </section>
        )}

        {/* ── REQUESTING PERMISSION ── */}
        {phase === 'requesting_permission' && (
          <section className="calib-card">
            <div className="calib-spinner" />
            <h2>Requesting Sensor Access</h2>
            <p>Please allow motion & orientation access when prompted.</p>
          </section>
        )}

        {/* ── RUNNING ── */}
        {phase === 'running' && (
          <section className="calib-card calib-running">
            <div className="calib-timer">
              <svg className="calib-ring" viewBox="0 0 120 120">
                <circle className="ring-bg" cx="60" cy="60" r="54" />
                <circle
                  className="ring-fg"
                  cx="60" cy="60" r="54"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - progressPercent / 100)}`}
                />
              </svg>
              <span className="calib-timer-label">
                {Math.ceil((progress.durationMs - progress.elapsedMs) / 1000)}s
              </span>
            </div>

            <div className="calib-stats">
              <Stat label="Samples" value={progress.sampleCount.toLocaleString()} />
              <Stat label="Rate" value={`${progress.actualHz} Hz`} />
              {refreshRate && <Stat label="Screen" value={`${refreshRate} Hz`} />}
            </div>

            <p className="calib-instruction">
              Move your device naturally. Tap this area for touch data.
            </p>

            <button className="btn-secondary" onClick={() => handleStop()}>
              Stop Early
            </button>
          </section>
        )}

        {/* ── COMPLETED ── */}
        {phase === 'completed' && (
          <section className="calib-card">
            <div className="calib-icon success">✓</div>
            <h2>Calibration Complete</h2>

            <div className="calib-stats">
              <Stat label="Total Samples" value={progress.sampleCount.toLocaleString()} />
              <Stat label="Avg Rate" value={`${progress.actualHz} Hz`} />
              <Stat label="Duration" value={`${(progress.elapsedMs / 1000).toFixed(1)}s`} />
              {refreshRate && <Stat label="Screen" value={`${refreshRate} Hz`} />}
            </div>

            {deviceProfile && (
              <div className="device-summary">
                <h3>Device Profile</h3>
                <code>{DeviceProfiler.summarize(deviceProfile).screen}</code>
                <code>{DeviceProfiler.summarize(deviceProfile).touch}</code>
                <code>{DeviceProfiler.summarize(deviceProfile).memory}</code>
                <code>{DeviceProfiler.summarize(deviceProfile).gyroNoise}</code>
              </div>
            )}

            <div className="export-buttons">
              {exportUrls.motionCSVUrl && (
                <a
                  href={exportUrls.motionCSVUrl}
                  download="sensei_motion.csv"
                  className="btn-export"
                >
                  Download Motion CSV
                </a>
              )}
              {exportUrls.touchCSVUrl && (
                <a
                  href={exportUrls.touchCSVUrl}
                  download="sensei_touch.csv"
                  className="btn-export"
                >
                  Download Touch CSV
                </a>
              )}
            </div>

            <button className="btn-secondary" onClick={handleReset}>
              Recalibrate
            </button>
          </section>
        )}

        {/* ── ERROR ── */}
        {phase === 'error' && (
          <section className="calib-card calib-error">
            <div className="calib-icon error">!</div>
            <h2>Calibration Error</h2>
            <p className="error-message">{errorMessage}</p>
            <p>Ensure your device has a gyroscope and that you allow sensor access.</p>
            <button className="btn-primary" onClick={handleReset}>
              Try Again
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default CalibrationScreen;
