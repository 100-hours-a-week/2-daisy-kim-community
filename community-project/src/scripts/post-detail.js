document.addEventListener("DOMContentLoaded", () => {
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

  let editingCommentIndex = null; // 수정 중인 댓글의 인덱스

  // LocalStorage에서 저장된 게시글 가져오기
  function getStoredPost() {
    const storedPost = localStorage.getItem("postData");
    return storedPost ? JSON.parse(storedPost) : null;
  }

  let postData = getStoredPost();

  if (postData) {
    postTitle.innerText = postData.title || "제목 없음";
    postAuthor.innerText = postData.author || "익명";
    postDate.innerText = postData.date || "날짜 없음";
    postContent.innerText = postData.content || "내용이 없습니다.";

    // 조회수 증가 (클릭 시 +1)
    postData.views = (postData.views || 0) + 1;
    viewCount.innerText = `${formatNumber(postData.views)} 조회수`;
    localStorage.setItem("postData", JSON.stringify(postData));

    likeBtn.innerText = `${formatNumber(postData.likes || 0)} 좋아요수`;
    commentCount.innerText = `${formatNumber(
      postData.comments?.length || 0
    )} 댓글`;

    // 프로필 이미지 설정
    postAuthorImg.src = postData.authorImg
      ? postData.authorImg
      : "../assets/images/default-profile.jpeg";

    // 게시글 이미지가 있으면 표시
    if (postData.image) {
      postImage.src = postData.image;
      postImage.style.display = "block";
    }
  }

  // 숫자 단위 변환 함수 (1k, 10k, 100k)
  function formatNumber(num) {
    if (num >= 100000) return `${Math.floor(num / 1000)}k`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num;
  }

  // 댓글 렌더링
  function renderComments() {
    commentList.innerHTML = "";
    if (postData && postData.comments?.length > 0) {
      postData.comments.forEach((comment, index) => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        commentElement.innerHTML = `
              <div class="comment-meta">
                <span class="comment-author">${comment.author || "익명"}</span>
                <span class="comment-date">${
                  comment.date || "YYYY-MM-DD HH:mm:ss"
                }</span>
              </div>
              <div class="comment-body">
                <span class="comment-text">${comment.text}</span>
              </div>
              <div class="comment-actions">
                <button class="edit-comment" data-index="${index}">수정</button>
                <button class="delete-comment" data-index="${index}">삭제</button>
              </div>
            `;
        commentList.appendChild(commentElement);
      });
    }
  }

  renderComments();

  // 댓글 입력 시 버튼 활성화
  commentInput.addEventListener("input", () => {
    commentSubmit.disabled = !commentInput.value.trim();
    commentSubmit.classList.toggle("active", commentInput.value.trim());
  });

  // 댓글 등록 및 수정 기능
  commentSubmit.addEventListener("click", () => {
    const commentText = commentInput.value.trim();
    if (!commentText) return;

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");

    if (editingCommentIndex !== null) {
      // 기존 댓글 수정
      postData.comments[editingCommentIndex].text = commentText;
      editingCommentIndex = null;
      commentSubmit.innerText = "댓글 등록"; // 버튼 원래대로 변경
    } else {
      // 새로운 댓글 등록
      const newComment = {
        text: commentText,
        author: "익명",
        date: formattedDate,
      };
      postData.comments = [...(postData.comments || []), newComment];
    }

    localStorage.setItem("postData", JSON.stringify(postData));

    renderComments();

    commentInput.value = "";
    commentSubmit.disabled = true;
    commentSubmit.classList.remove("active");
  });

  // 댓글 수정 및 삭제 이벤트 리스너
  commentList.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-comment")) {
      // 수정 버튼 클릭 시
      const index = event.target.getAttribute("data-index");
      editingCommentIndex = index;
      commentInput.value = postData.comments[index].text; // 기존 댓글 내용 가져오기
      commentSubmit.innerText = "댓글 수정";
      commentSubmit.classList.add("active");
      commentSubmit.disabled = false;
    } else if (event.target.classList.contains("delete-comment")) {
      // 삭제 버튼 클릭 시 모달 띄우기
      deleteModal.style.display = "flex";
      editingCommentIndex = event.target.getAttribute("data-index");
    }
  });

  // 삭제 모달 확인 버튼
  confirmDelete.addEventListener("click", () => {
    if (editingCommentIndex !== null) {
      postData.comments.splice(editingCommentIndex, 1);
      localStorage.setItem("postData", JSON.stringify(postData));
      renderComments();
      editingCommentIndex = null;
    }
    deleteModal.style.display = "none";
  });

  // 삭제 모달 취소 버튼
  cancelDelete.addEventListener("click", () => {
    deleteModal.style.display = "none";
  });

  // 좋아요 버튼 클릭 시 증가/감소
  likeBtn.addEventListener("click", () => {
    if (!postData.liked) {
      postData.likes += 1;
      likeBtn.classList.add("liked");
    } else {
      postData.likes -= 1;
      likeBtn.classList.remove("liked");
    }
    postData.liked = !postData.liked;
    likeBtn.innerText = `${formatNumber(postData.likes)} 좋아요수`;
    localStorage.setItem("postData", JSON.stringify(postData));
  });
});
