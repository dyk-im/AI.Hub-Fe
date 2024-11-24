import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import LoginModal from "./comp/login/LoginModal";
import SignupModal from "./comp/login/SignupModal";
import SignupInitialModal from "./comp/login/SignupInitialModal";
import FindPwModal from "./comp/login/FindPwModal";
import Footer from "./comp/Footer/Footer";
import MainPage from "./comp/article/MainPage";
import "./App.css";

function AppRouter() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignupInitial, setShowSignupInitial] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showFindPw, setShowFindPw] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token); // 토큰 저장
    setIsLoggedIn(true); // 로그인 상태 업데이트
    navigate("/main"); // 메인 페이지로 이동
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // 토큰 삭제
    setIsLoggedIn(false);
    navigate("/home"); // 홈 페이지로 이동
  };

  return (
    <Routes>
      {/* 로그인 상태에 따라 메인 또는 홈으로 리디렉션 */}
      <Route path="/" element={<Navigate to={isLoggedIn ? "/main" : "/home"} />} />

      {/* 홈 페이지 */}
      <Route
        path="/home"
        element={
          <>
          <div className="App">
            <div className="left-container">
              <div className="logo-text">AI.</div>
              <div className="logo-hub">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hub</div>
            </div>
            <div className="right-containers">
              <h2 className="description-text">소중한 AI 경험을 공유하세요</h2>
              <br />
              <br />
              <br />
              <div className="button-section">
                <button className="login-btn" onClick={() => setShowLogin(true)}>
                  <b>로그인</b>
                </button>
                <div className="divider">
                  ------------------- 계정이 없다면 -------------------
                </div>
                <button className="signup-btn" onClick={() => setShowSignupInitial(true)}>
                  <b>회원가입</b>
                </button>
              </div>
            </div>
            </div>
            {/* 모달 컴포넌트 */}
            {showLogin && (
              <LoginModal
                onClose={() => setShowLogin(false)}
                onPasswordRecovery={() => setShowFindPw(true)}
                onLoginSuccess={handleLoginSuccess}
              />
            )}
            {showSignupInitial && (
              <SignupInitialModal
                onClose={() => setShowSignupInitial(false)}
                onEmailVerified={() => {
                  setShowSignupInitial(false);
                  setShowSignup(true);
                }}
              />
            )}
            {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
            {showFindPw && <FindPwModal onClose={() => setShowFindPw(false)} />}
            <Footer />
          </>
        }
      />

      {/* 메인 페이지 */}
      <Route
        path="/main"
        element={isLoggedIn ? <MainPage onLogout={handleLogout} /> : <Navigate to="/home" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
