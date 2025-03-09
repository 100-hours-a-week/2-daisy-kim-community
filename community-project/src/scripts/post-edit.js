document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const imageUpload = document.getElementById("image-upload");
  const imagePreview = document.getElementById("image-preview");
  const updateBtn = document.getElementById("update-btn");
  const errorMessage = document.getElementById("error-message");

  // 회원 정보 수정 관련 요소
  const nicknameInput = document.getElementById("nickname");
  const passwordInput = document.getElementById("password");
  const profileImageInput = document.getElementById("profile-image");
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const profileErrorMessage = document.getElementById("profile-error-message");

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const token = localStorage.getItem("token");

  if (!postId || !token) {
    alert("잘못된 접근입니다. 로그인 후 다시 시도해주세요.");
    window.location.href = "login.html";
    return;
  }

  // 🔥 기존 게시글 데이터 가져오기
  async function fetchPostData() {
    try {
      const response = await fetch(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const result = await response.json();
        const postData = result.data[0];

        titleInput.value = postData.title || "";
        contentInput.value = postData.content || "";
        if (postData.image) {
          imagePreview.src = postData.image;
          imagePreview.style.display = "block";
        }
      } else if (response.status === 404) {
        alert("게시글을 찾을 수 없습니다.");
        window.location.href = "index.html";
      }
    } catch (error) {
      console.error("게시글 불러오기 오류:", error);
    }
  }

  // 🔥 입력값 변경 시 버튼 활성화
  function checkFormValidity() {
    if (titleInput.value.trim() && contentInput.value.trim()) {
      updateBtn.disabled = false;
      updateBtn.classList.add("active");
      errorMessage.style.display = "none";
    } else {
      updateBtn.disabled = true;
      updateBtn.classList.remove("active");
      errorMessage.style.display = "block";
    }
  }

  titleInput.addEventListener("input", checkFormValidity);
  contentInput.addEventListener("input", checkFormValidity);

  // 🔥 이미지 업로드 미리보기
  imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // 🔥 게시글 수정 API 연결
  updateBtn.addEventListener("click", async () => {
    if (!titleInput.value.trim() || !contentInput.value.trim()) {
      errorMessage.style.display = "block";
      return;
    }

    const requestBody = {
      title: titleInput.value.trim(),
      content: contentInput.value.trim(),
    };

    if (imagePreview.src && imagePreview.style.display !== "none") {
      requestBody.postImage = imagePreview.src;
    }

    try {
      const response = await fetch(`/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.status === 200) {
        alert("게시글이 성공적으로 수정되었습니다.");
        window.location.href = `post-detail.html?id=${postId}`;
      } else if (response.status === 400) {
        errorMessage.textContent = "잘못된 요청입니다.";
        errorMessage.style.display = "block";
      } else if (response.status === 401) {
        alert("로그인이 필요합니다.");
        window.location.href = "login.html";
      } else if (response.status === 403) {
        alert("이 게시글을 수정할 권한이 없습니다.");
      } else if (response.status === 404) {
        alert("게시글을 찾을 수 없습니다.");
        window.location.href = "index.html";
      } else if (response.status === 500) {
        errorMessage.textContent =
          "서버 오류가 발생했습니다. 다시 시도해주세요.";
        errorMessage.style.display = "block";
      }
    } catch (error) {
      console.error("게시글 수정 요청 중 오류 발생:", error);
      errorMessage.textContent = "네트워크 오류가 발생했습니다.";
      errorMessage.style.display = "block";
    }
  });

  // 초기 게시글 데이터 불러오기
  fetchPostData();
});
