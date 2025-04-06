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

  function validateAndUpdateForm() {
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    let emailValid = validateEmail(emailValue);
    let passwordValid = validatePassword(passwordValue);

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

  emailInput.addEventListener("input", validateAndUpdateForm);
  passwordInput.addEventListener("input", validateAndUpdateForm);

  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!validateEmail(email) || !validatePassword(password)) {
      loginError.textContent = "* 올바른 이메일과 비밀번호를 입력해주세요.";
      loginError.classList.add("show");
      return;
    }

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.status === 200) {
        // 로그인 성공 처리
        localStorage.setItem("user_id", result.data.userId);
        localStorage.setItem("token", result.data.token);

        alert("로그인 성공!");
        window.location.href = "post.html"; // 로그인 성공 후 페이지 이동
      } else if (response.status === 400) {
        loginError.textContent = "* 잘못된 요청입니다.";
        loginError.classList.add("show");
      } else if (response.status === 401) {
        loginError.textContent = "* 이메일 또는 비밀번호가 일치하지 않습니다.";
        loginError.classList.add("show");
      } else if (response.status === 500) {
        loginError.textContent =
          "* 서버 오류가 발생했습니다. 다시 시도해주세요.";
        loginError.classList.add("show");
      }
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      loginError.textContent = "* 네트워크 오류가 발생했습니다.";
      loginError.classList.add("show");
    }
  });

  signupBtn.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "signup.html";
  });
});
