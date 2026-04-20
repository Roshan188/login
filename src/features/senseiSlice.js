import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Iteration 1 — sensor capture
  calibrationPhase: 'idle', // idle | requesting_permission | running | completed | error
  calibrationDurationMs: 60000,
  elapsedMs: 0,
  sampleCount: 0,
  actualHz: 0,
  permissionGranted: false,
  sensorSupported: null, // null = unknown, true/false
  errorMessage: null,

  // Device profile (populated after profiling)
  deviceProfile: null,

  // Raw data handles (stored outside Redux as blobs — only metadata here)
  motionCSVUrl: null,
  touchCSVUrl: null,
  lastExportedAt: null,

  // Iteration 3+ — preferences (placeholder)
  preferences: null,

  // Iteration 6+ — sensitivity output (placeholder)
  sensitivityOutput: null,
};

const senseiSlice = createSlice({
  name: 'sensei',
  initialState,
  reducers: {
    setPermissionGranted(state, action) {
      state.permissionGranted = action.payload;
    },
    setSensorSupported(state, action) {
      state.sensorSupported = action.payload;
    },
    setCalibrationPhase(state, action) {
      state.calibrationPhase = action.payload;
    },
    updateCalibrationProgress(state, action) {
      state.elapsedMs = action.payload.elapsedMs;
      state.sampleCount = action.payload.sampleCount;
      state.actualHz = action.payload.actualHz;
    },
    setDeviceProfile(state, action) {
      state.deviceProfile = action.payload;
    },
    setExportedCSVUrls(state, action) {
      state.motionCSVUrl = action.payload.motionCSVUrl;
      state.touchCSVUrl = action.payload.touchCSVUrl;
      state.lastExportedAt = Date.now();
    },
    setError(state, action) {
      state.calibrationPhase = 'error';
      state.errorMessage = action.payload;
    },
    resetCalibration(state) {
      state.calibrationPhase = 'idle';
      state.elapsedMs = 0;
      state.sampleCount = 0;
      state.actualHz = 0;
      state.errorMessage = null;
      state.motionCSVUrl = null;
      state.touchCSVUrl = null;
    },
  },
});

export const {
  setPermissionGranted,
  setSensorSupported,
  setCalibrationPhase,
  updateCalibrationProgress,
  setDeviceProfile,
  setExportedCSVUrls,
  setError,
  resetCalibration,
} = senseiSlice.actions;

// Selectors
export const selectCalibrationPhase = (state) => state.sensei.calibrationPhase;
export const selectCalibrationProgress = (state) => ({
  elapsedMs: state.sensei.elapsedMs,
  sampleCount: state.sensei.sampleCount,
  actualHz: state.sensei.actualHz,
  durationMs: state.sensei.calibrationDurationMs,
});
export const selectPermissionGranted = (state) => state.sensei.permissionGranted;
export const selectSensorSupported = (state) => state.sensei.sensorSupported;
export const selectDeviceProfile = (state) => state.sensei.deviceProfile;
export const selectExportUrls = (state) => ({
  motionCSVUrl: state.sensei.motionCSVUrl,
  touchCSVUrl: state.sensei.touchCSVUrl,
  lastExportedAt: state.sensei.lastExportedAt,
});
export const selectError = (state) => state.sensei.errorMessage;

export default senseiSlice.reducer;
