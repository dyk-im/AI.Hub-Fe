import React, { useEffect, useState } from "react";
import ProfileEditModal from "./ProfileEditModal"; // ProfileEditModal import
import api from "../../api/axios"; // Axios 인스턴스 import
import "../css/ProfileModal.css";

function ProfileModal({ isOpen, onClose }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태
  const [userPosts, setUserPosts] = useState([]); // 사용자 게시물 상태
  const [loading, setLoading] = useState(false); // 로딩 상태

   // 사용자 정보 및 게시물 가져오기
   useEffect(() => {
    const fetchProfileData = async () => {
      if (!isOpen) return; // 모달이 열리지 않았을 경우 아무 작업도 하지 않음

      try {
        setLoading(true);

        // 사용자 정보 가져오기
        const userInfoResponse = await api.get("/profile/myinfo");
        const fetchedUserInfo = userInfoResponse.data.result;
        setUserInfo(fetchedUserInfo);

        // 사용자 게시물 가져오기
        const userPostsResponse = await api.get(`/article/${fetchedUserInfo.customId}/list`);
        setUserPosts(userPostsResponse.data.result);
      } catch (error) {
        console.error("프로필 정보 및 게시물 불러오기 실패:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isOpen]);

  // 게시물 삭제 처리
  const handleDeletePost = async (postId) => {
    try {
      await api.patch(`/article/${postId}`);
      setUserPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("게시물 삭제 실패:", error.response?.data || error.message);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="profile-modal">
        <div className="profile-modal-content">
          <h3>로딩 중...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-modal">
      <div className="profile-modal-content">
        {/* 닫기 버튼 */}
        <button className="profile-modal-close" onClick={onClose}>
          ✖
        </button>

        {/* 수정 버튼 */}
        <button
          className="profile-modal-edit"
          onClick={() => setIsEditModalOpen(true)} // 수정 모달 열기
        >
          수정
        </button>

        {/* 사용자 정보 */}
        <h3 className="profile-modal-header">프로필</h3>
        <div className="profile-basic-info">
          <div className="profile-info-row">
            <span>이름:</span>
            <span>{userInfo?.userName}</span>
          </div>
          <div className="profile-info-row">
            <span>ID:</span>
            <span>{userInfo?.customId}</span>
          </div>
          <div className="profile-info-row">
            <span>이메일:</span>
            <span>{userInfo?.email}</span>
          </div>
          <div className="profile-info-row">
            <span>전화번호:</span>
            <span>{userInfo?.phoneNumber}</span>
          </div>
        </div>

        {/* 작성한 게시물 */}
        <h4 className="profile-modal-header">게시물</h4>
        <div className="profile-posts-container">
          {userPosts.map((post) => (
            <div key={post.id} className="ppost-item">
              <button
                className="post-delete-btn"
                onClick={() => handleDeletePost(post.id)}
              >
                삭제
              </button>
              <span className="pcustom-id">{post.writer}</span>
              <h3 className="ppost-title">{post.title}</h3>
              <p className="ppost-content">{post.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ProfileEditModal 호출 */}
      {isEditModalOpen && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)} // 수정 모달 닫기
          userInfo={userInfo}
          onSave={(updatedInfo) => {
            setUserInfo(updatedInfo);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default ProfileModal;