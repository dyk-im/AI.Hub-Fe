import React, { useState } from "react";
import api from "../../api/axios"; // axios 설정 파일 가져오기
import "../css/FindPwModal.css";

function FindPwModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 이메일 발송 요청
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/email/send", { email });
      setStep(2);
      setErrorMessage(""); // 에러 메시지 초기화
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
      await api.post("/auth/email/check", { email, authNum: verificationCode });
      setStep(3);
      setErrorMessage(""); // 에러 메시지 초기화
      console.log("인증 코드 확인 성공");
    } catch (error) {
      console.error("인증 코드 확인 실패:", error.response?.data || error.message);
      setErrorMessage("인증 코드 확인 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 새 비밀번호 설정 요청
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }
    try {
      await api.post("/auth/reset-password", { email, newPassword });
      setErrorMessage("");
      console.log("비밀번호 재설정 성공");
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("비밀번호 재설정 실패:", error.response?.data || error.message);
      setErrorMessage("비밀번호 재설정 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>비밀번호 찾기</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="recovery-form">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="form-submit-btn">이메일 인증</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerificationSubmit} className="verification-form">
            <input
              type="text"
              placeholder="인증 코드"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <button type="submit" className="form-submit-btn">인증 확인</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="new-password-form">
            <input
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="form-submit-btn">완료</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default FindPwModal;