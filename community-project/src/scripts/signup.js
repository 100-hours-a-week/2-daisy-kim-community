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

  const emailError = document.querySelector(".email-error");
  const passwordError = document.querySelector(".password-error");
  const confirmPasswordError = document.querySelector(
    ".confirm-password-error"
  );
  const nicknameError = document.querySelector(".nickname-error");

  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/.test(
      password
    );
  }

  function validateNickname(nickname) {
    return /^[^\s]{1,10}$/.test(nickname); // 닉네임은 10자 이내, 공백 없음
  }

  function checkFormValidity() {
    let isValid = true;

    // 이메일 유효성 검사
    if (emailInput.value.trim() === "") {
      emailError.textContent = "* 이메일을 입력해주세요.";
      emailError.classList.add("show");
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      emailError.textContent =
        "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
      emailError.classList.add("show");
      isValid = false;
    } else {
      emailError.classList.remove("show");
    }

    // 비밀번호 유효성 검사
    if (passwordInput.value.trim() === "") {
      passwordError.textContent = "* 비밀번호를 입력해주세요.";
      passwordError.classList.add("show");
      isValid = false;
    } else if (!validatePassword(passwordInput.value)) {
      passwordError.textContent =
        "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
      passwordError.classList.add("show");
      isValid = false;
    } else {
      passwordError.classList.remove("show");
    }

    // 비밀번호 확인 검사
    if (confirmPasswordInput.value.trim() === "") {
      confirmPasswordError.textContent = "* 비밀번호를 한번 더 입력하세요.";
      confirmPasswordError.classList.add("show");
      isValid = false;
    } else if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordError.textContent = "* 비밀번호가 다릅니다.";
      confirmPasswordError.classList.add("show");
      isValid = false;
    } else {
      confirmPasswordError.classList.remove("show");
    }

    // 닉네임 유효성 검사
    if (nicknameInput.value.trim() === "") {
      nicknameError.textContent = "* 닉네임을 입력해주세요.";
      nicknameError.classList.add("show");
      isValid = false;
    } else if (!validateNickname(nicknameInput.value)) {
      nicknameError.textContent =
        "* 닉네임은 띄어쓰기 없이 10자 이내여야 합니다.";
      nicknameError.classList.add("show");
      isValid = false;
    } else {
      nicknameError.classList.remove("show");
    }

    // 모든 입력값이 유효하면 버튼 활성화
    signupBtn.disabled = !isValid;
    signupBtn.classList.toggle("active", isValid);
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
