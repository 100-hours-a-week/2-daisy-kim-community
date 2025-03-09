document.addEventListener("DOMContentLoaded", async () => {
  const postTitle = document.getElementById("post-title");
  const postAuthor = document.getElementById("post-author");
  const postDate = document.getElementById("post-date");
  const postContent = document.getElementById("post-content");
  const postImage = document.getElementById("post-image");
  const postAuthorImg = document.getElementById("post-author-img");
  const likeBtn = document.getElementById("like-btn");
  const viewCount = document.getElementById("view-count");
  const commentCount = document.getElementById("comment-count");
  const commentList = document.getElementById("comment-list");
  const commentInput = document.getElementById("comment-input");
  const commentSubmit = document.getElementById("comment-submit");
  const deleteModal = document.getElementById("delete-modal");
  const confirmDelete = document.getElementById("confirm-delete");
  const cancelDelete = document.getElementById("cancel-delete");
  const editBtn = document.getElementById("edit-btn");

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const token = localStorage.getItem("token");

  if (!postId) {
    alert("잘못된 접근입니다.");
    window.location.href = "index.html";
    return;
  }

  // 숫자 단위 변환 함수 (1k, 10k, 100k)
  function formatNumber(num) {
    if (num >= 100000) return `${Math.floor(num / 1000)}k`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num;
  }

  // 🔥 게시글 상세 조회
  async function fetchPostDetails() {
    try {
      const response = await fetch(`/posts/${postId}`);
      const result = await response.json();

      if (response.status === 200) {
        const postData = result.data[0];

        postTitle.innerText = postData.title || "제목 없음";
        postAuthor.innerText = postData.author.nickname || "익명";
        postDate.innerText = new Date(postData.created_at).toLocaleString();
        postContent.innerText = postData.content || "내용이 없습니다.";
        viewCount.innerText = `${formatNumber(postData.view_count)} 조회수`;
        likeBtn.innerText = `${formatNumber(postData.like_count)} 좋아요수`;
        commentCount.innerText = `${formatNumber(postData.comment_count)} 댓글`;

        postAuthorImg.src =
          postData.author.profile_image ||
          "../assets/images/default-profile.jpeg";

        if (postData.image) {
          postImage.src = postData.image;
          postImage.style.display = "block";
        }

        likeBtn.dataset.liked = postData.liked ? "true" : "false";
        likeBtn.classList.toggle("liked", postData.liked);

        fetchComments();
      }
    } catch (error) {
      console.error("게시글 요청 중 오류 발생:", error);
    }
  }

  // 🔥 좋아요 버튼 클릭 이벤트 리스너
  likeBtn.addEventListener("click", async () => {
    try {
      const liked = likeBtn.dataset.liked === "true";
      const response = await fetch(`/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ like: !liked }),
      });

      const result = await response.json();
      if (response.status === 200) {
        likeBtn.dataset.liked = (!liked).toString();
        likeBtn.innerText = `${formatNumber(result.data.like_count)} 좋아요수`;
        likeBtn.classList.toggle("liked", !liked);
      }
    } catch (error) {
      console.error("좋아요 요청 중 오류 발생:", error);
    }
  });

  // 🔥 댓글 목록 조회
  async function fetchComments() {
    try {
      const response = await fetch(`/posts/${postId}/comments`);
      const result = await response.json();

      if (response.status === 200) renderComments(result.data);
    } catch (error) {
      console.error("댓글 요청 중 오류 발생:", error);
    }
  }

  // 댓글 렌더링
  function renderComments(comments) {
    commentList.innerHTML = "";
    comments.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");
      commentElement.innerHTML = `
        <div class="comment-meta">
          <img src="${
            comment.author.profileImage
          }" class="comment-author-img" />
          <span class="comment-author">${comment.author.nickname}</span>
          <span class="comment-date">${new Date(
            comment.createdAt
          ).toLocaleString()}</span>
        </div>
        <div class="comment-body">
          <span class="comment-text">${comment.content}</span>
        </div>
        <div class="comment-actions">
          <button class="edit-comment" data-id="${
            comment.commentId
          }">수정</button>
          <button class="delete-comment" data-id="${
            comment.commentId
          }">삭제</button>
        </div>
      `;
      commentList.appendChild(commentElement);
    });
  }

  // 🔥 댓글 등록 이벤트 리스너
  commentSubmit.addEventListener("click", async () => {
    const commentText = commentInput.value.trim();
    if (!commentText) return;

    try {
      const response = await fetch(`/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      });

      if (response.status === 201) fetchComments();
    } catch (error) {
      console.error("댓글 등록 중 오류 발생:", error);
    }

    commentInput.value = "";
  });

  // 🔥 댓글 수정 및 삭제 이벤트 리스너
  commentList.addEventListener("click", async (event) => {
    const commentId = event.target.dataset.id;
    if (!commentId) return;

    if (event.target.classList.contains("edit-comment")) {
      const newText = prompt("수정할 내용을 입력하세요:");
      if (!newText) return;

      try {
        await fetch(`/posts/${postId}/comments/${commentId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newText }),
        });
        fetchComments();
      } catch (error) {
        console.error("댓글 수정 중 오류 발생:", error);
      }
    }

    if (event.target.classList.contains("delete-comment")) {
      const confirmDelete = confirm("정말 삭제하시겠습니까?");
      if (!confirmDelete) return;

      try {
        await fetch(`/posts/${postId}/comments/${commentId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchComments();
      } catch (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
      }
    }
  });

  // 🔥 게시글 삭제 이벤트 리스너
  confirmDelete.addEventListener("click", async () => {
    try {
      await fetch(`/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("게시글이 삭제되었습니다.");
      window.location.href = "index.html";
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
    }
  });

  // 🔥 게시글 수정 페이지 이동 이벤트 리스너
  editBtn.addEventListener("click", () => {
    window.location.href = `post-edit.html?id=${postId}`;
  });

  // 초기 데이터 불러오기
  await fetchPostDetails();
});
