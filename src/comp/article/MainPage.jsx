import React, { useEffect, useState } from "react";
import axios from "../../api/axios"; // axios 인스턴스 사용
import "../css/MainPage.css";
import PostModal from "./PostModal";
import ProfileModal from "./ProfileModal";
import PostDetailModal from "./PostDetailModal";

function MainPage() {
  const [userName, setUserName] = useState(""); // 사용자 이름 상태
  const [posts, setPosts] = useState([]); // 게시글 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 다음 페이지 데이터 존재 여부
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false); // 상세 모달 상태
  const [currentTime, setCurrentTime] = useState("");

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      localStorage.removeItem("token"); // 로컬 스토리지에서 토큰 삭제
      window.location.href = "/home"; // 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error.response?.data || error.message);
      alert("로그아웃 중 문제가 발생했습니다.");
    }
  };

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/profile/myinfo");
        setUserName(response.data.result.username); // 사용자 이름 설정
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // 시계 설정
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateClock(); // 초기 시간 설정
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // 게시글 데이터 가져오기
  const loadPosts = async (page) => {
    if (loading) return; // 이미 로딩 중이면 중복 요청 방지
    setLoading(true);
  
    try {
      const response = await axios.get("/article", {
        params: { page, size: 10 }, // 페이지네이션 요청
      });
      const newPosts = response.data.result;
  
      setPosts((prevPosts) => {
        const existingIds = new Set(prevPosts.map((post) => post.articleId));
        const filteredPosts = newPosts.filter((post) => !existingIds.has(post.articleId)); // 중복 제거
        return [...prevPosts, ...filteredPosts];
      });
  
      if (newPosts.length < 10) {
        setHasMore(false); // 더 이상 데이터 없음
      }
    } catch (error) {
      console.error("게시글 로드 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // 첫 로딩 시 게시글 가져오기
  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  // 페이지를 증가시켜 다음 게시글 로드
  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // 게시글 작성 모달 열기/닫기 함수
  const openPostModal = () => setIsPostModalOpen(true);
  const closePostModal = () => setIsPostModalOpen(false);

  const toggleProfileModal = () => setIsProfileModalOpen((prev) => !prev);

  const openPostDetailModal = (post) => {
    setSelectedPost(post);
    setIsPostDetailOpen(true);
  };

  const closePostDetailModal = () => {
    setSelectedPost(null);
    setIsPostDetailOpen(false);
  };
  const resetState = async () => {
    try {
      setPosts([]);
      setCurrentPage(1);
      setHasMore(true);
      await loadPosts(1); // 첫 페이지 데이터 로드
    } catch (error) {
      console.error("초기화 중 오류 발생:", error);
    }
  };
  

  return (
    <div className="main-layout">
      {/* 사이드바 */}
      <aside className="sidebar">
        <div className="logo-side">
          <div className="logo-text-side">AI.</div>
          <div className="logo-hub-side">Hub</div>
        </div>
        <nav className="menu">
          <button className="menu-item" onClick={resetState}>
            HOME
          </button>
          <button className="menu-item" onClick={toggleProfileModal}>
            PROFILE
          </button>
          <button className="menu-item-post" onClick={openPostModal}>
            POST
          </button>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="content">
        <header className="header">
          <div className="sentence">
            안녕하세요 {userName || "User"}님
          </div>
          <div className="sentence2">방문을 환영합니다.</div>
          <div className="sentence2">오늘도 AI.Hub에서 소중한 시간 함께해요.</div>
        </header>

        {/* 게시글 리스트 */}
        <section className="posts-container">
  {posts.map((post) => (
    <div key={post.articleId} className="post-item">
      <span className="custom-id">{post.username}</span>
      <div className="con">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-content">{post.content}</p>
      </div>
      <div className="post-actions">
        <span className="view-count">Like {post.likeCnt}</span>
        {/* Reply 버튼 추가 */}
        <button
          className="view-count"
          onClick={() => openPostDetailModal(post)} // 클릭 시 모달 열기
        >
          Reply {post.commentCnt}
        </button>
        <span className="view-count">View {post.viewCnt}</span>
      </div>
    </div>
  ))}
  {hasMore && (
    <button className="plus" onClick={handleLoadMore} disabled={loading}>
      {loading ? "Loading..." : "더 보기"}
    </button>
  )}
</section>
      </main>

      {/* 오른쪽 위젯 */}
      <div className="right-container">
        <div className="clock">{currentTime}</div>
        <div className="widget">
          <h3>공지사항</h3>
          <p>시스템 점검: 매주 일요일 오전 2시</p>
        </div>
        <div className="widget">
          <h3>주의사항</h3>
          <p>스팸성 게시물 금지</p>
        </div>
        <div className="widget">
          <h3>알림</h3>
          <p>알림 리스트</p>
        </div>
      </div>

      {/* PostModal */}
      {isPostModalOpen && (
        <PostModal
          isOpen={isPostModalOpen}
          onClose={closePostModal}
          onSubmit={(newPost) => {
            setPosts((prevPosts) => [newPost, ...prevPosts]);
            closePostModal();
          }}
        />
      )}

      {/* ProfileModal */}
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={toggleProfileModal}
          userInfo={{ username: userName }}
        />
      )}

      {/* PostDetailModal */}
      {isPostDetailOpen && selectedPost && (
        <PostDetailModal
          isOpen={isPostDetailOpen}
          onClose={closePostDetailModal}
          post={selectedPost}
          currentUserId={userName}
        />
      )}
    </div>
  );
}

export default MainPage;
