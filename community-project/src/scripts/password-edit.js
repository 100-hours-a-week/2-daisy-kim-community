document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const updateBtn = document.getElementById("update-btn");
  const passwordError = document.querySelector(".password-error");
  const confirmPasswordError = document.querySelector(
    ".confirm-password-error"
  );
  const toast = document.getElementById("toast");

  // 비밀번호 유효성 검사 함수
  function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/;
    return regex.test(password);
  }

  function checkFormValidity() {
    const passwordValue = passwordInput.value.trim();
    const confirmPasswordValue = confirmPasswordInput.value.trim();
    let isValid = true;

    // 비밀번호 유효성 검사
    if (!passwordValue) {
      passwordError.textContent = "* 비밀번호를 입력해주세요.";
      passwordError.style.display = "block";
      isValid = false;
    } else if (!validatePassword(passwordValue)) {
      passwordError.textContent =
        "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
      passwordError.style.display = "block";
      isValid = false;
    } else {
      passwordError.style.display = "none";
    }

    // 비밀번호 확인 검사
    if (!confirmPasswordValue) {
      confirmPasswordError.textContent = "* 비밀번호를 한번 더 입력해주세요.";
      confirmPasswordError.style.display = "block";
      isValid = false;
    } else if (passwordValue !== confirmPasswordValue) {
      confirmPasswordError.textContent = "* 비밀번호와 다릅니다.";
      confirmPasswordError.style.display = "block";
      isValid = false;
    } else {
      confirmPasswordError.style.display = "none";
    }

    // 버튼 활성화/비활성화
    updateBtn.disabled = !isValid;
    updateBtn.classList.toggle("active", isValid);
  }

  // 입력 필드 변화 감지
  passwordInput.addEventListener("input", checkFormValidity);
  confirmPasswordInput.addEventListener("input", checkFormValidity);

  // 비밀번호 변경 처리
  updateBtn.addEventListener("click", () => {
    const passwordValue = passwordInput.value.trim();

    if (!validatePassword(passwordValue)) return;

    // 비밀번호 저장 (로컬스토리지에 업데이트)
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    userData.password = passwordValue;
    localStorage.setItem("userData", JSON.stringify(userData));

    // 성공 메시지 표시
    toast.style.opacity = "1";
    setTimeout(() => {
      toast.style.opacity = "0";
    }, 2000);
  });
});
