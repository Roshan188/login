import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, provider } from '../firebase';
import { setActiveUser, setUserLogOutState, selectUserName } from '../features/userSlice';
import CalibrationScreen from './CalibrationScreen';
import './HomeScreen.css';

function HomeScreen() {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);

  const handleSignIn = () => {
    auth.signInWithPopup(provider).then((result) => {
      dispatch(setActiveUser({
        userName: result.user.displayName,
        userEmail: result.user.email,
      }));
    });
  };

  const handleSignOut = () => {
    auth.signOut().then(() => dispatch(setUserLogOutState()));
  };

  // Show calibration screen once signed in (or skip auth for local dev)
  if (userName) {
    return (
      <div className="home-wrapper">
        <div className="home-topbar">
          <span className="home-user">👤 {userName}</span>
          <button className="btn-signout" onClick={handleSignOut}>Sign Out</button>
        </div>
        <CalibrationScreen />
      </div>
    );
  }

  return (
    <div className="home-landing">
      <header className="landing-header">
        <h1 className="landing-title">SENSEI</h1>
        <p className="landing-sub">Your Personal BGMI Sensitivity Coach</p>
      </header>

      <section className="landing-features">
        <Feature icon="🎯" text="AI-calibrated sensitivity for YOUR hands" />
        <Feature icon="📡" text="Uses your device gyroscope &amp; touch data" />
        <Feature icon="🔬" text="60-second biomechanical profiling" />
        <Feature icon="🎮" text="Outputs all 22 BGMI sensitivity values" />
      </section>

      <button className="btn-signin" onClick={handleSignIn}>
        Sign in with Google to Start
      </button>

      <p className="landing-privacy">
        All sensor data stays on your device. No raw motion data is uploaded.
      </p>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="feature-row">
      <span className="feature-icon">{icon}</span>
      <span className="feature-text" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}

export default HomeScreen;
