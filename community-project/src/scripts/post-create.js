document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const imageInput = document.getElementById("image-upload");
  const submitBtn = document.getElementById("submit-btn");
  const errorMessage = document.getElementById("error-message");
  const imagePreview = document.getElementById("image-preview");

  // 이미지 미리보기 기능
  imageInput.addEventListener("change", (event) => {
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

  // 입력값 유효성 검사
  function checkFormValidity() {
    const isTitleValid = titleInput.value.trim() !== "";
    const isContentValid = contentInput.value.trim() !== "";

    if (isTitleValid && isContentValid) {
      submitBtn.disabled = false;
      submitBtn.classList.add("active");
      errorMessage.style.display = "none";
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.remove("active");
    }
  }

  titleInput.addEventListener("input", checkFormValidity);
  contentInput.addEventListener("input", checkFormValidity);

  // 완료 버튼 클릭 이벤트
  submitBtn.addEventListener("click", () => {
    if (!titleInput.value.trim() || !contentInput.value.trim()) {
      errorMessage.style.display = "block";
      return;
    }

    // LocalStorage에 데이터 저장
    const postData = {
      title: titleInput.value.trim(),
      content: contentInput.value.trim(),
      image: imagePreview.src || "../assets/images/default-profile.jpeg",
      date: new Date().toISOString().slice(0, 19).replace("T", " "), // yyyy-mm-dd hh:mm:ss 형식
    };

    localStorage.setItem("postData", JSON.stringify(postData));

    // 게시글 목록 페이지로 이동
    window.location.href = "post.html";
  });
});
