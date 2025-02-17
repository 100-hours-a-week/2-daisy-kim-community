document.addEventListener("DOMContentLoaded", () => {
  const postList = document.getElementById("post-list");
  const createPostBtn = document.getElementById("create-post-btn");

  // 게시글 작성 페이지로 이동
  createPostBtn.addEventListener("click", () => {
    window.location.href = "post-create.html";
  });

  // 더미 게시글 데이터
  const dummyPosts = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    title: `제목 ${i + 1}`.slice(0, 26), // 제목 길이 제한
    likes: Math.floor(Math.random() * 2000),
    comments: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 100000),
    author: `작성자 ${i + 1}`,
    date: "2021-01-01 00:00:00",
  }));

  // 숫자 단위 변환 함수 (1k, 10k, 100k)
  function formatNumber(num) {
    if (num >= 100000) return `${Math.floor(num / 1000)}k`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num;
  }

  // 게시글 렌더링 함수
  function renderPosts(posts) {
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
            <img src="../assets/images/default-profile.jpeg" alt="프로필" />
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

  // 인피니트 스크롤 구현
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      renderPosts(dummyPosts.slice(0, 5)); // 추가 로드
    }
  });

  // 초기 렌더링
  renderPosts(dummyPosts.slice(0, 10));
});
