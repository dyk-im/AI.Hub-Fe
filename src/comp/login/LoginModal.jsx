import React from "react";
import "../css/LoginModal.css";

function LoginModal({ onClose }) {
  // Google OAuth URL 설정 (백엔드의 Google OAuth2 엔드포인트로 설정)
  const googleOAuthUrl = "http://localhost:8080/oauth2/authorize/google";

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>로그인</h2>
        <form className="login-form">
          <input type="text" placeholder="이메일" required />
          <input type="password" placeholder="비밀번호" required />
          <button type="submit" className="form-submit-btn"><strong>로그인</strong></button>
        </form>
        <button type="button" className="google-login-btn">비밀번호 찾기</button><br/>
        <button className="google-login-btn" onClick={() => window.location.href = googleOAuthUrl}>
          Google로 로그인하기
        </button>
      </div>
    </div>
  );
}

export default LoginModal;