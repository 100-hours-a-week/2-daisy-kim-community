// /js/postEvents.js
import {
  toggleLike,
  createComment,
  updateComment,
  deleteComment,
  deletePost,
} from "./postApi.js";

export function setupPostEventHandlers({
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
}) {
  // 좋아요
  likeBtn.addEventListener("click", async () => {
    const liked = likeBtn.dataset.liked === "true";
    const result = await toggleLike(postId, liked, token);
    likeBtn.dataset.liked = (!liked).toString();
    likeBtn.innerText = `${formatNumber(result.data.like_count)} 좋아요수`;
    likeBtn.classList.toggle("liked", !liked);
  });

  // 댓글 등록
  commentSubmit.addEventListener("click", async () => {
    const commentText = commentInput.value.trim();
    if (!commentText) return;
    const response = await createComment(postId, commentText, token);
    if (response.status === 201) fetchAndRenderComments();
    commentInput.value = "";
  });

  // 댓글 수정/삭제
  commentList.addEventListener("click", async (event) => {
    const commentId = event.target.dataset.id;
    if (!commentId) return;

    if (event.target.classList.contains("edit-comment")) {
      const newText = prompt("수정할 내용을 입력하세요:");
      if (!newText) return;
      await updateComment(postId, commentId, newText, token);
      fetchAndRenderComments();
    }

    if (event.target.classList.contains("delete-comment")) {
      const confirmDelete = confirm("정말 삭제하시겠습니까?");
      if (!confirmDelete) return;
      await deleteComment(postId, commentId, token);
      fetchAndRenderComments();
    }
  });

  // 게시글 삭제
  confirmDelete.addEventListener("click", async () => {
    await deletePost(postId, token);
    alert("게시글이 삭제되었습니다.");
    window.location.href = "index.html";
  });

  // 게시글 수정
  editBtn.addEventListener("click", () => {
    window.location.href = `post-edit.html?id=${postId}`;
  });
}
