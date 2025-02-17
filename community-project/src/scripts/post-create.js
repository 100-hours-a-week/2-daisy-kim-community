document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const imageUpload = document.getElementById("image-upload");
  const imagePreview = document.getElementById("image-preview");
  const submitBtn = document.getElementById("submit-btn");
  const errorMessage = document.getElementById("error-message");

  // 제목 입력 제한 (최대 26자)
  titleInput.addEventListener("input", () => {
    if (titleInput.value.length > 26) {
      titleInput.value = titleInput.value.slice(0, 26);
    }
    validateForm();
  });

  // 이미지 업로드 미리보기
  imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // 제목과 내용 입력 여부 확인 후 버튼 활성화
  function validateForm() {
    if (titleInput.value.trim() !== "" && contentInput.value.trim() !== "") {
      submitBtn.classList.add("active");
      submitBtn.disabled = false;
      errorMessage.style.display = "none";
    } else {
      submitBtn.classList.remove("active");
      submitBtn.disabled = true;
    }
  }

  titleInput.addEventListener("input", validateForm);
  contentInput.addEventListener("input", validateForm);

  // 완료 버튼 클릭 시 유효성 검사
  submitBtn.addEventListener("click", () => {
    if (titleInput.value.trim() === "" || contentInput.value.trim() === "") {
      errorMessage.style.display = "block";
    } else {
      alert("게시글이 작성되었습니다!");
      window.location.href = "post.html"; // 게시판으로 이동
    }
  });
});
