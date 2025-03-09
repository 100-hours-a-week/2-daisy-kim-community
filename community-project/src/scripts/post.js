document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("../components/header.html"); // 상대 경로 사용
    const html = await response.text();
    document.getElementById("header-container").innerHTML = html;

    if (!document.querySelector('script[src="../components/header.js"]')) {
      const script = document.createElement("script");
      script.src = "../components/header.js"; // 상대 경로 사용
      script.defer = true;
      document.body.appendChild(script);
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const scripts = tempDiv.querySelectorAll("script");

    scripts.forEach((script) => {
      const newScript = document.createElement("script");
      if (script.src) {
        newScript.src = script.src;
        newScript.defer = true;
      } else {
        newScript.textContent = script.textContent;
      }
      document.body.appendChild(newScript);
    });
  } catch (error) {
    console.error("헤더를 불러오는 중 오류 발생:", error);
  }

  const postList = document.getElementById("post-list");
  const createPostBtn = document.getElementById("create-post-btn");

  // 게시글 작성 페이지로 이동
  createPostBtn.addEventListener("click", () => {
    window.location.href = "post-create.html";
  });

  // 숫자 단위 변환 함수 (1k, 10k, 100k)
  function formatNumber(num) {
    if (num >= 100000) return `${Math.floor(num / 1000)}k`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num;
  }

  // 게시글 목록 조회 API 연결
  async function fetchPosts() {
    try {
      const response = await fetch("/posts");

      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
      }

      const result = await response.json();

      if (response.status === 200) {
        console.log("게시글 불러오기 성공:", result.data);
        renderPosts(result.data);
      } else if (response.status === 400) {
        console.error("잘못된 요청:", result.message);
        alert("잘못된 요청입니다.");
      } else if (response.status === 500) {
        console.error("서버 오류:", result.message);
        alert("서버 오류로 인해 게시글을 불러올 수 없습니다.");
      }
    } catch (error) {
      console.error("게시글 요청 중 오류 발생:", error);
      alert("네트워크 오류가 발생했습니다.");
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
            <span>좋아요 ${formatNumber(post.likeCount)}</span>
            <span>댓글 ${formatNumber(post.commentCount)}</span>
            <span>조회수 ${formatNumber(post.viewCount)}</span>
          </div>
          <span>${new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="post-author">
          <img src="${post.author.profileImage}" alt="프로필" />
          <span>${post.author.nickname}</span>
        </div>
      `;

      // 게시글 클릭 시 상세 페이지 이동
      postElement.addEventListener("click", () => {
        window.location.href = `post-detail.html?id=${post.postId}`;
      });

      postList.appendChild(postElement);
    });
  }

  // 초기 게시글 불러오기
  await fetchPosts();

  // 인피니트 스크롤 구현
  window.addEventListener("scroll", async () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      await fetchPosts(); // 스크롤 시 추가 게시글 로드
    }
  });
});
