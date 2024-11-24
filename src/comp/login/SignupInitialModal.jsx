import React, { useState } from "react";
import api from "../../api/axios"; // axios 설정 파일 가져오기
import "../css/SignupInitialModal.css";

function SignupInitialModal({ onClose, onEmailVerified }) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 이메일 발송 요청
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/email/send", { email });
      setEmailSent(true);
      setErrorMessage(""); // 이전 에러 메시지 초기화
      console.log("이메일 인증 코드 발송 성공");
    } catch (error) {
      console.error("이메일 발송 실패:", error.response?.data || error.message);
      setErrorMessage("이메일 발송 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 인증 코드 확인 요청
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/email/check", {
        email,
        authNum: verificationCode,
      });
      console.log("인증 성공:", response.data);
      onEmailVerified(); // 부모 컴포넌트에 인증 성공 알림
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("인증 실패:", error.response?.data || error.message);
      setErrorMessage("인증 코드 확인 중 문제가 발생했습니다. 다시 확인해주세요.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>회원가입 - 이메일 인증</h2>
        {!emailSent ? (
          <form onSubmit={handleEmailSubmit} className="email-form">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="form-submit-btn">
              이메일 인증
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerificationSubmit} className="verification-form">
            <input
              type="text"
              placeholder="인증 코드"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <button type="submit" className="form-submit-btn">
              인증 확인
            </button>
          </form>
        )}
        {/* 오류 메시지 표시 */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
}

export default SignupInitialModal;