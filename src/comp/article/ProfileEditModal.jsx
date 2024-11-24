import React, { useState } from "react";
import axios from "../../api/axios"; // axios 인스턴스 가져오기
import "../css/ProfileEditModal.css";

function ProfileEditModal({ isOpen, onClose, userInfo, onSave }) {
  const [editedInfo, setEditedInfo] = useState(userInfo);
  const [passwordConfirm, setPasswordConfirm] = useState(""); // 비밀번호 확인 상태
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 오류 메시지
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const handleChange = (field, value) => {
    setEditedInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // 비밀번호 확인 검사
    if (editedInfo.password && editedInfo.password !== passwordConfirm) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true); // 저장 시작

      // API 호출로 수정된 정보 전송
      const response = await axios.patch("/profile/myinfo", editedInfo);

      console.log("프로필 수정 성공:", response.data);

      // 부모 컴포넌트로 업데이트된 정보 전달
      onSave(editedInfo);

      // 모달 닫기
      onClose();
    } catch (error) {
      console.error("프로필 수정 실패:", error.response?.data || error.message);
      alert("프로필 수정 중 문제가 발생했습니다.");
    } finally {
      setLoading(false); // 저장 완료
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-edit-modal">
      <div className="profile-edit-modal-content">
        <button className="profile-edit-modal-close" onClick={onClose}>
          ✖
        </button>
        <h3 className="profile-edit-modal-header">프로필 수정</h3>
        <div className="profile-edit-form">
          <input
            type="text"
            placeholder="커스텀ID"
            value={editedInfo.customId || ""}
            onChange={(e) => handleChange("customId", e.target.value)}
          />
          <input
            type="text"
            placeholder="유저명"
            value={editedInfo.userName || ""}
            onChange={(e) => handleChange("userName", e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={editedInfo.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          {passwordError && (
            <p className="password-error-message">{passwordError}</p>
          )}
          <input
            type="text"
            placeholder="전화번호"
            value={editedInfo.phoneNumber || ""}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
          <input
            type="date"
            placeholder="생일"
            value={editedInfo.birth || ""}
            onChange={(e) => handleChange("birth", e.target.value)}
          />
        </div>
        <button
          className="profile-edit-save-btn"
          onClick={handleSave}
          disabled={loading} // 로딩 중일 때 버튼 비활성화
        >
          {loading ? "저장 중..." : "완료"}
        </button>
      </div>
    </div>
  );
}

export default ProfileEditModal;