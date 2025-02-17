document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const emailError = document.querySelector(".email-error");
  const passwordError = document.querySelector(".password-error");
  const loginError = document.querySelector(".login-error");

  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  function validatePassword(password) {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return passwordPattern.test(password);
  }

  function checkFormValidity() {
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    let emailValid = validateEmail(emailValue);
    let passwordValid = validatePassword(passwordValue);

    // 이메일 유효성 검사 메시지 표시
    if (emailValue === "") {
      emailError.textContent = "* 이메일을 입력해주세요";
      emailError.classList.add("show");
    } else if (!emailValid) {
      emailError.textContent =
        "* 올바른 이메일 주소 형식을 입력해주세요 (예: example@example.com)";
      emailError.classList.add("show");
    } else {
      emailError.classList.remove("show");
    }

    // 비밀번호 유효성 검사 메시지 표시
    if (passwordValue === "") {
      passwordError.textContent = "* 비밀번호를 입력해주세요";
      passwordError.classList.add("show");
    } else if (!passwordValid) {
      passwordError.textContent =
        "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
      passwordError.classList.add("show");
    } else {
      passwordError.classList.remove("show");
    }

    if (emailValid && passwordValid) {
      loginBtn.classList.add("active");
      loginBtn.disabled = false;
    } else {
      loginBtn.classList.remove("active");
      loginBtn.disabled = true;
    }
  }

  emailInput.addEventListener("input", checkFormValidity);
  passwordInput.addEventListener("input", checkFormValidity);

  // 로그인 버튼 클릭 이벤트
  loginBtn.addEventListener("click", () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      loginError.textContent = "* 가입된 이메일이 없습니다.";
      loginError.classList.add("show");
      return;
    }

    if (emailInput.value !== savedUser.email) {
      loginError.textContent = "* 해당 이메일로 가입된 계정이 없습니다.";
      loginError.classList.add("show");
      return;
    }

    if (passwordInput.value !== savedUser.password) {
      loginError.textContent = "* 비밀번호가 일치하지 않습니다.";
      loginError.classList.add("show");
      return;
    }

    alert("로그인 성공!");
    window.location.href = "post.html"; // 로그인 성공 후 이동
  });

  // 회원가입 페이지 이동
  signupBtn.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "signup.html";
  });
});
