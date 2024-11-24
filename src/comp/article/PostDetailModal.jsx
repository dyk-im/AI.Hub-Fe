import React, { useState, useEffect } from "react";
import api from "../../api/axios"; // 작성한 axios 객체 가져오기
import "../css/PostDetailModal.css";

function PostDetailModal({ isOpen, onClose, postId, currentUserId }) {
  const [post, setPost] = useState(null); // 게시글 정보
  const [comments, setComments] = useState([]); // 댓글 목록
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    if (isOpen && postId) {
      fetchPostDetails();
    }
  }, [isOpen, postId]);

   // 게시글 상세 조회
   const fetchPostDetails = async () => {
    try {
      const response = await api.get(`/article/${postId}`);
      const data = response.data.result;
      setPost(data);
      setComments(data.comments || []);
      setIsLiked(data.liked || false);
      setLoading(false);
    } catch (error) {
      console.error("게시글 조회 실패:", error.response?.data || error.message);
      alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
      onClose();
    }
  };

  // 댓글 추가
  const handleCommentSubmit = async () => {
    if (newComment.trim() !== "") {
      try {
        const response = await api.post(`/comment/${post.id}`, {content: newComment,
        });
        const addedComment = {
          id: response.data.result.id, // 서버 응답에서 ID 가져오기
          text: newComment,
          authorId: currentUserId,
          createdAt: new Date().toISOString(),
        };

        setComments((prevComments) => [...prevComments, addedComment]);
        setNewComment("");
      } catch (error) {
        console.error("댓글 추가 실패:", error.response?.data || error.message);
      }
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    try {
      await api.patch(`/comment/${commentId}`);
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("댓글 삭제 실패:", error.response?.data || error.message);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 좋아요 토글
  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        await api.patch(`/article/${post.id}/unlike`);
      } else {
        await api.post(`/article/${post.id}/like`);
      }
      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error("좋아요 토글 실패:", error.response?.data || error.message);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen || loading) return null; // 로딩 중에는 아무것도 렌더링하지 않음

  return (
    <div className="a-post-detail-modal">
      <div className="a-post-detail-modal-content">
        {/* 닫기 버튼 */}
        <button className="a-post-detail-modal-close" onClick={onClose}>
          ✖
        </button>

        {/* 게시글 작성자 */}
        <div className="a-post-header">
          <span className="a-post-author">{post.customId}</span>
        </div>

        {/* 게시글 내용 */}
        <div className="a-post-content">
          <h3 className="a-post-title">{post.title}</h3>
          <p className="a-post-body">{post.content}</p>

        </div>

        {/* 좋아요 및 댓글 입력 */}
        <div className="a-comment-input-section">
        <input
            type="text"
            className="a-comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요."
          />
          <button
            className={`a-like-btn ${isLiked ? "a-liked" : ""}`}
            onClick={handleLikeToggle}
          >
            {isLiked ? "Unlike" : "Like"}
          </button>
          <button className="a-comment-submit-btn" onClick={handleCommentSubmit}>
            Submit
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="a-comment-list">
          {comments.map((comment) => (
            <div key={comment.id} className="a-comment-item">
              <div className="a-comment-header">
                <span className="a-comment-author">{comment.authorId}</span>
                <span className="a-comment-timestamp">
                  {formatter.format(new Date(comment.createdAt))}
                </span>
                {comment.authorId === currentUserId && (
                  <button
                    className="a-comment-delete-btn"
                    onClick={() => handleCommentDelete(comment.id)}
                  >
                    삭제
                  </button>
                )}
              </div>
              <div className="a-comment-text">{comment.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostDetailModal;