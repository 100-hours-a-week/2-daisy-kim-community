document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const imageUpload = document.getElementById("image-upload");
  const imagePreview = document.getElementById("image-preview");
  const updateBtn = document.getElementById("update-btn");
  const errorMessage = document.getElementById("error-message");

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
});
