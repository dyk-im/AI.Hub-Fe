import React, { useState } from "react";
import api from "../../api/axios"; // axios 설정 파일 가져오기
import "../css/LoginModal.css";

function LoginModal({ onClose, onLoginSuccess, onPasswordRecovery }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태
  const [loading, setLoading] = useState(false);

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await api.post("/auth/login", { email, password });
  
      // 1. 응답 헤더에서 Access Token 가져오기
      const accessToken = response.headers["authorization"];
      if (!accessToken) {
        throw new Error("Access Token이 헤더에 포함되지 않았습니다.");
      }
  
      // 2. Local Storage에 저장
      localStorage.setItem("token", accessToken);
      console.log("Access Token 저장 성공:", localStorage.getItem("token"));
  
      // 3. 로그인 성공 처리
      onLoginSuccess(accessToken);
      onClose();
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "로그인 실패: 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>로그인</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="form-submit-btn1" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 오류 메시지 표시 */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button
          type="button"
          className="google-login-btn"
          onClick={onPasswordRecovery} // 부모 컴포넌트에서 처리
        >
          비밀번호 찾기
        </button>
      </div>
    </div>
  );
}

export default LoginModal;