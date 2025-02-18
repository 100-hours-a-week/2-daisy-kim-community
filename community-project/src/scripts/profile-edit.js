document.addEventListener("DOMContentLoaded", () => {
  const profileInput = document.getElementById("profile-img");
  const profilePreview = document.getElementById("profile-preview-img");
  const emailElement = document.getElementById("email");
  const nicknameInput = document.getElementById("nickname");
  const updateBtn = document.getElementById("update-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const nicknameError = document.querySelector(".nickname-error");
  const toast = document.getElementById("toast");

  // 로컬스토리지에서 사용자 정보 불러오기
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  if (userData.nickname) nicknameInput.value = userData.nickname;
  if (userData.profileImage) profilePreview.src = userData.profileImage;
  emailElement.textContent = userData.email || "이메일 없음";

  // 프로필 사진 변경 미리보기
  profileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // 닉네임 검증 함수
  function validateNickname(nickname) {
    if (!nickname.trim()) {
      return "* 닉네임을 입력해주세요";
    }
    if (nickname.length > 10) {
      return "* 닉네임은 최대 10자까지 작성 가능합니다";
    }
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    if (existingUsers.some((user) => user.nickname === nickname)) {
      return "* 중복된 닉네임입니다";
    }
    return "";
  }

  // 수정하기 버튼 클릭 시
  updateBtn.addEventListener("click", () => {
    const nicknameValue = nicknameInput.value.trim();
    const validationMessage = validateNickname(nicknameValue);

    if (validationMessage) {
      nicknameError.textContent = validationMessage;
      nicknameError.classList.add("show");
      return;
    }

    // 닉네임 업데이트
    userData.nickname = nicknameValue;
    userData.profileImage = profilePreview.src;
    localStorage.setItem("userData", JSON.stringify(userData));

    // 성공 메시지 표시
    toast.style.opacity = "1";
    setTimeout(() => {
      toast.style.opacity = "0";
    }, 2000);
  });

  // 회원 탈퇴 버튼 클릭 시
  deleteBtn.addEventListener("click", () => {
    localStorage.removeItem("userData");
    window.location.href = "login.html";
  });
});
