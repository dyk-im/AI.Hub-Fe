import React, { useState } from "react";
import axios from "../../api/axios"; // axios 인스턴스
import "../css/PostModal.css";

function PostModal({ isOpen, onClose, onSubmit }) {
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "리뷰" }); // 초기값에 카테고리 포함
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!newPost.title || !newPost.content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/article", newPost); // API 호출
      alert("게시글이 성공적으로 작성되었습니다.");
      onSubmit(response.data.result); // 작성된 게시글 데이터 전달
      onClose();
    } catch (error) {
      console.error("게시글 작성 실패:", error.response?.data || error.message);
      alert("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post2-modal">
      <div className="post2-modal-content">
        <button className="post2-modal-close" onClick={onClose}>
          ✖
        </button>
        <h3 className="post2-modal-header">Post</h3>
        <div className="post2-form-group">
          <input
            type="text"
            placeholder="title"
            className="post2-title-input"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
        </div>
        <div className="post2-form-group">
          <textarea
            className="post2-content-input"
            placeholder="content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          ></textarea>
        </div>
        <div className="post2-actions">
          {/* 카테고리 옵션 */}
          <select
            className="post2-category-select"
            value={newPost.category}
            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
          >
            <option value="소개">소개</option>
            <option value="질문">질문</option>
            <option value="리뷰">리뷰</option>
          </select>

          {/* 게시 버튼 */}
          <button
            className="post2-submit-button"
            onClick={handleSubmit}
            disabled={loading} // 로딩 중일 때 비활성화
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostModal;