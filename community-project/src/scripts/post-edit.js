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

  // 기존 게시글 데이터 가져오기
  function getStoredPost() {
    const storedPost = localStorage.getItem("postData");
    return storedPost ? JSON.parse(storedPost) : null;
  }

  let postData = getStoredPost();

  if (postData) {
    titleInput.value = postData.title || "";
    contentInput.value = postData.content || "";
    if (postData.image) {
      imagePreview.src = postData.image;
      imagePreview.style.display = "block";
    }
  }

  // 입력값 변경 시 버튼 활성화
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

  // 이미지 업로드 미리보기
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

  // 수정 버튼 클릭 시 저장 후 상세페이지 이동
  updateBtn.addEventListener("click", () => {
    if (!titleInput.value.trim() || !contentInput.value.trim()) {
      errorMessage.style.display = "block";
      return;
    }

    postData.title = titleInput.value.trim();
    postData.content = contentInput.value.trim();
    if (imagePreview.src) {
      postData.image = imagePreview.src;
    }

    localStorage.setItem("postData", JSON.stringify(postData));

    window.location.href = "post-detail.html";
  });

  // 회원 정보 수정 API 연결
  editProfileBtn.addEventListener("click", async () => {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      profileErrorMessage.textContent = "로그인이 필요합니다.";
      profileErrorMessage.style.display = "block";
      return;
    }

    const newNickname = nicknameInput.value.trim();
    const newPassword = passwordInput.value.trim();
    const newProfileImage = profileImageInput.value.trim();

    if (!newNickname && !newPassword && !newProfileImage) {
      profileErrorMessage.textContent = "변경할 내용을 입력해주세요.";
      profileErrorMessage.style.display = "block";
      return;
    }

    const requestBody = {};
    if (newNickname) requestBody.nickname = newNickname;
    if (newPassword) requestBody.password = newPassword;
    if (newProfileImage) requestBody.profile_image = newProfileImage;

    try {
      const response = await fetch(`/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.status === 200) {
        alert("회원 정보가 성공적으로 수정되었습니다.");
      } else if (response.status === 400) {
        profileErrorMessage.textContent = "잘못된 요청입니다.";
        profileErrorMessage.style.display = "block";
      } else if (response.status === 401) {
        profileErrorMessage.textContent = "로그인이 필요합니다.";
        profileErrorMessage.style.display = "block";
      } else if (response.status === 409) {
        profileErrorMessage.textContent = "이미 사용 중인 닉네임입니다.";
        profileErrorMessage.style.display = "block";
      } else if (response.status === 500) {
        profileErrorMessage.textContent =
          "서버 오류가 발생했습니다. 다시 시도해주세요.";
        profileErrorMessage.style.display = "block";
      }
    } catch (error) {
      console.error("회원 정보 수정 요청 중 오류 발생:", error);
      profileErrorMessage.textContent = "네트워크 오류가 발생했습니다.";
      profileErrorMessage.style.display = "block";
    }
  });
});
