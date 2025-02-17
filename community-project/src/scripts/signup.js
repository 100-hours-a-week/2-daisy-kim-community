document.addEventListener("DOMContentLoaded", () => {
  const profileInput = document.getElementById("profile-img");
  const profilePreview = document.getElementById("profile-preview-img");

  // 프로필 사진 업로드 이벤트
  profileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePreview.src = e.target.result;
        profilePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const nicknameInput = document.getElementById("nickname");
  const signupBtn = document.getElementById("signup-btn");

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/.test(
      password
    );
  }

  function checkFormValidity() {
    const emailValid = validateEmail(emailInput.value);
    const passwordValid = validatePassword(passwordInput.value);
    const confirmPasswordValid =
      passwordInput.value === confirmPasswordInput.value &&
      passwordInput.value !== "";
    const nicknameValid = nicknameInput.value.trim().length > 0;

    signupBtn.disabled = !(
      emailValid &&
      passwordValid &&
      confirmPasswordValid &&
      nicknameValid
    );
    signupBtn.classList.toggle(
      "active",
      emailValid && passwordValid && confirmPasswordValid && nicknameValid
    );
  }

  emailInput.addEventListener("input", checkFormValidity);
  passwordInput.addEventListener("input", checkFormValidity);
  confirmPasswordInput.addEventListener("input", checkFormValidity);
  nicknameInput.addEventListener("input", checkFormValidity);

  signupBtn.addEventListener("click", () => {
    if (!signupBtn.disabled) {
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      window.location.href = "login.html";
    }
  });
});
