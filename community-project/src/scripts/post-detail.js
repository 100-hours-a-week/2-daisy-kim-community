import { fetchPostDetails, fetchComments } from "./postApi.js";
import { setupPostEventHandlers } from "./postEvents.js";

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

  function formatNumber(num) {
    if (num >= 100000) return `${Math.floor(num / 1000)}k`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num;
  }

  function renderComments(comments) {
    commentList.innerHTML = "";
    const template = document.getElementById("comment-template");

    comments.forEach((comment) => {
      const clone = template.content.cloneNode(true);
      clone.querySelector(".comment-author-img").src =
        comment.author.profileImage;
      clone.querySelector(".comment-author").textContent =
        comment.author.nickname;
      clone.querySelector(".comment-date").textContent = new Date(
        comment.createdAt
      ).toLocaleString();
      clone.querySelector(".comment-text").textContent = comment.content;

      clone.querySelector(".edit-comment").dataset.id = comment.commentId;
      clone.querySelector(".delete-comment").dataset.id = comment.commentId;

      commentList.appendChild(clone);
    });
  }

  async function fetchAndRenderPost() {
    const { response, result } = await fetchPostDetails(postId);
    if (response.status === 200) {
      const postData = result.data[0];
      postTitle.innerText = postData.title || "제목 없음";
      postAuthor.innerText = postData.author.nickname || "익명";
      postDate.innerText = new Date(postData.created_at).toLocaleString();
      postContent.innerText = postData.content || "내용 없음";
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

      await fetchAndRenderComments();
    }
  }

  async function fetchAndRenderComments() {
    const result = await fetchComments(postId);
    if (result && result.data) renderComments(result.data);
  }

  setupPostEventHandlers({
    postId,
    token,
    likeBtn,
    commentInput,
    commentSubmit,
    commentList,
    deleteModal,
    confirmDelete,
    editBtn,
    fetchAndRenderPost,
    fetchAndRenderComments,
    formatNumber,
  });

  await fetchAndRenderPost();
});
