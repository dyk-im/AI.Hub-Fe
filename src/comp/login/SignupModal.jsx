import React, { useState } from "react";
import api from "../../api/axios"; // axios 설정 파일 가져오기
import "../css/SignupModal.css";

function SignupModal({ onClose }) {
  const [formData, setFormData] = useState({
    userName: "",
    customId: "",
    phoneNumber: "",
    birth: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지 상태

  // 입력값 변경 핸들러
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 회원가입 처리 함수
  const handleSignup = async (e) => {
    e.preventDefault(); // 폼 기본 동작 방지
    setErrorMessage(""); // 초기화
    setSuccessMessage(""); // 초기화

    // 비밀번호 확인 검사
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData; // confirmPassword 제외하고 전송
      const response = await api.post("/auth/register", signupData);
      setSuccessMessage("회원가입에 성공했습니다. 로그인 해주세요!");
      console.log("회원가입 성공:", response.data);
      // 성공 시 동작 추가 가능 (e.g., 모달 닫기, 리디렉션)
    } catch (error) {
      console.error("회원가입 실패:", error.response?.data || error.message);
      setErrorMessage("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>회원가입</h2>
        <form className="signup-form" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="이름"
            value={formData.userName}
            onChange={(e) => handleChange("userName", e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="커스텀 ID"
            value={formData.customId}
            onChange={(e) => handleChange("customId", e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="전화번호"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="생일"
            value={formData.birth}
            onChange={(e) => handleChange("birth", e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="이메일"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
          />
          <button type="submit" className="form-submit-btn">
            <b>가입하기</b>
          </button>
        </form>
        {/* 오류 메시지 표시 */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {/* 성공 메시지 표시 */}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    </div>
  );
}

export default SignupModal;