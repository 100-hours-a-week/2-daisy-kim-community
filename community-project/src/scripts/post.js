document.addEventListener("DOMContentLoaded", () => {
  const postList = document.getElementById("post-list");
  const createPostBtn = document.getElementById("create-post-btn");

  // 게시글 작성 페이지로 이동
  createPostBtn.addEventListener("click", () => {
    window.location.href = "post-create.html";
  });

  // LocalStorage에서 저장된 게시글 가져오기
  function getStoredPost() {
    const storedPost = localStorage.getItem("postData");
    return storedPost ? JSON.parse(storedPost) : null;
  }

  // 숫자 단위 변환 함수 (1k, 10k, 100k)
  function formatNumber(num) {
    if (num >= 100000) return `${Math.floor(num / 1000)}k`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num;
  }

  // 더미 게시글 데이터
  let dummyPosts = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    title: `제목 ${i + 1}`.slice(0, 26), // 제목 길이 제한
    likes: Math.floor(Math.random() * 2000),
    comments: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 100000),
    author: `작성자 ${i + 1}`,
    date: "2021-01-01 00:00:00",
    image: "../assets/images/default-profile.jpeg",
  }));

  // 저장된 게시글이 있으면 최상단에 추가 & 최신 좋아요, 댓글, 조회수 반영
  const storedPost = getStoredPost();
  if (storedPost) {
    let updatedPost = {
      id: 0,
      title: storedPost.title,
      likes: storedPost.likes || 0,
      comments: storedPost.comments?.length || 0,
      views: storedPost.views || 0,
      author: storedPost.author || "익명",
      date: storedPost.date,
      image: storedPost.image || "../assets/images/default-profile.jpeg",
    };

    // 기존 목록에서 해당 게시글 업데이트
    let existingPostIndex = dummyPosts.findIndex((post) => post.id === 0);
    if (existingPostIndex !== -1) {
      dummyPosts[existingPostIndex] = updatedPost;
    } else {
      dummyPosts.unshift(updatedPost);
    }
  }

  // 게시글 렌더링 함수
  function renderPosts(posts) {
    postList.innerHTML = ""; // 기존 목록 초기화
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post-card");
      postElement.innerHTML = `
        <div class="post-title">${post.title}</div>
        <div class="post-meta">
          <div class="post-stats">
            <span>좋아요 ${formatNumber(post.likes)}</span>
            <span>댓글 ${formatNumber(post.comments)}</span>
            <span>조회수 ${formatNumber(post.views)}</span>
          </div>
          <span>${post.date}</span>
        </div>
        <div class="post-author">
          <img src="${post.image}" alt="프로필" />
          <span>${post.author}</span>
        </div>
      `;

      // 게시글 클릭 시 상세 페이지 이동
      postElement.addEventListener("click", () => {
        window.location.href = `post-detail.html?id=${post.id}`;
      });

      postList.appendChild(postElement);
    });
  }

  // 초기 렌더링 (최신 데이터 반영)
  renderPosts(dummyPosts);

  // 인피니트 스크롤 구현
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      renderPosts(dummyPosts.slice(0, 5));
    }
  });
});
