import React from "react";
import "../css/SignupModal.css";

function SignupModal({ onClose }) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>×</button>
          <h2>회원가입</h2>
          <form className="signup-form">
            <input type="text" placeholder="이름" required />
            <input type="text" placeholder="커스텀 ID" required />
            <input type="text" placeholder="전화번호" required />
            <input type="date" placeholder="생일" required />
            <input type="password" placeholder="비밀번호" required />
            <input type="password" placeholder="비밀번호 확인" required />
            <button type="submit" className="form-submit-btn"><b>가입하기</b></button>
          </form>
        </div>
      </div>
    );
  }

export default SignupModal;