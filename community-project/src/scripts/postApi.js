// /js/postApi.js
export async function fetchPostDetails(postId) {
  const response = await fetch(`/posts/${postId}`);
  const result = await response.json();
  return { response, result };
}

export async function toggleLike(postId, liked, token) {
  const response = await fetch(`/posts/${postId}/like`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ like: !liked }),
  });
  return await response.json();
}

export async function fetchComments(postId) {
  const response = await fetch(`/posts/${postId}/comments`);
  return await response.json();
}

export async function createComment(postId, commentText, token) {
  return await fetch(`/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: commentText }),
  });
}

export async function updateComment(postId, commentId, newText, token) {
  return await fetch(`/posts/${postId}/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: newText }),
  });
}

export async function deleteComment(postId, commentId, token) {
  return await fetch(`/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deletePost(postId, token) {
  return await fetch(`/posts/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
