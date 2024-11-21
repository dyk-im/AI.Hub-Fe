import React, { useState } from "react";
import "../css/GoogleSignupModal.css";

function GoogleSignupModal({ onClose, onSignupComplete }) {
  const [customId, setCustomId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 회원가입 완료 로직을 추가합니다.
    onSignupComplete();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>추가 정보 입력</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            placeholder="커스텀 ID"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="form-submit-btn">가입하기</button>
        </form>
      </div>
    </div>
  );
}

export default GoogleSignupModal;