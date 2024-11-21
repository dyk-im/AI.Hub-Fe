import React, { useState } from "react";
import LoginModal from "./comp/login/LoginModal";
import SignupModal from "./comp/login/SignupModal";
import SignupInitialModal from "./comp/login/SignupInitialModal";
import GoogleSignupModal from "./comp/login/GoogleSignupModal";
import Footer from "./comp/Footer/Footer";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignupInitial, setShowSignupInitial] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showGoogleSignup, setShowGoogleSignup] = useState(false);

  const openLoginModal = () => setShowLogin(true);
  const closeLoginModal = () => setShowLogin(false);

  const openSignupInitialModal = () => setShowSignupInitial(true);
  const closeSignupInitialModal = () => setShowSignupInitial(false);

  const openSignupModal = () => {
    setShowSignupInitial(false);
    setShowSignup(true);
  };
  const closeSignupModal = () => setShowSignup(false);

  const openGoogleSignupModal = () => setShowGoogleSignup(true);
  const closeGoogleSignupModal = () => setShowGoogleSignup(false);

  const googleOAuthUrl = "http://localhost:8080/oauth2/authorize/google";

  // Google OAuth 성공 시 호출
  const handleGoogleAuthSuccess = () => {
    openGoogleSignupModal();
  };

  return (
    <div className="App">
      <div className="left-container">
        <div className="logo-text">AI.</div>
        <div className="logo-hub">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hub</div>
      </div>
      <div className="right-container">
        <h2 className="description-text">소중한 AI 경험을 공유하세요</h2> <br/><br/><br/>
        <div className="button-section">
          <button className="login-btn" onClick={openLoginModal}><b>로그인</b></button>
          <div className="divider">------------------- 계정이 없다면 -------------------</div>
          <button className="signup-btn" onClick={openSignupInitialModal}><b>회원가입</b></button>
          <button className="google-btn" onClick={() => window.location.href = googleOAuthUrl}>Google로 회원가입</button>
        </div>
      </div>

      {showLogin && <LoginModal onClose={closeLoginModal} />}
      {showSignupInitial && <SignupInitialModal onClose={closeSignupInitialModal} onEmailVerified={openSignupModal} />}
      {showSignup && <SignupModal onClose={closeSignupModal} />}
      {showGoogleSignup && <GoogleSignupModal onClose={closeGoogleSignupModal} onSignupComplete={() => setShowGoogleSignup(false)} />}
      <Footer />
    </div>
  );
}

export default App;