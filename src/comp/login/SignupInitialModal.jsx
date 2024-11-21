import React, { useState } from "react";
import "../css/SignupInitialModal.css";

function SignupInitialModal({ onClose, onEmailVerified }) {
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // 이메일 발송 요청 (백엔드 구현되어 있다고 가정)
    setEmailSent(true);
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    // 인증 코드 확인 로직 (여기서는 단순히 완료된 것으로 가정)
    if (verificationCode) {
      onEmailVerified();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>회원가입 - 이메일 인증</h2>
        {!emailSent ? (
          <form onSubmit={handleEmailSubmit} className="email-form">
            <input type="email" placeholder="이메일" required />
            <button type="submit" className="form-submit-btn">이메일 인증</button>
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
            <button type="submit" className="form-submit-btn">인증 확인</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignupInitialModal;