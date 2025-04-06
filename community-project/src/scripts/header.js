document.addEventListener("DOMContentLoaded", () => {
  console.log("header.js 로드 완료! ✅");

  const profileBtn = document.getElementById("profile-btn");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const logoutBtn = document.getElementById("logout-btn");

  if (!profileBtn || !dropdownMenu || !logoutBtn) {
    console.error("필요한 요소를 찾을 수 없습니다.");
    return;
  }

  console.log("요소 발견:", profileBtn, dropdownMenu, logoutBtn);

  // 프로필 버튼 클릭 시 드롭다운 메뉴 토글
  profileBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdownMenu.classList.toggle("show");
    console.log("드롭다운 토글됨!");
  });

  // 드롭다운 외부 클릭 시 닫기
  document.addEventListener("click", (event) => {
    if (
      !profileBtn.contains(event.target) &&
      !dropdownMenu.contains(event.target)
    ) {
      dropdownMenu.classList.remove("show");
      console.log("드롭다운 닫힘!");
    }
  });

  // 로그아웃 버튼 클릭 시 API 호출
  logoutBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("토큰 없음: 이미 로그아웃된 상태입니다.");
      localStorage.removeItem("user_id");
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.status === 200) {
        console.log("로그아웃 성공:", result.message);
        alert("로그아웃 되었습니다.");
      } else if (response.status === 400) {
        console.warn("유효하지 않은 토큰:", result.message);
        alert("로그아웃 실패: 다시 로그인 후 시도해주세요.");
      } else if (response.status === 500) {
        console.error("서버 오류:", result.message);
        alert("서버 오류로 인해 로그아웃에 실패했습니다.");
        return;
      }
    } catch (error) {
      console.error("로그아웃 요청 중 오류 발생:", error);
      alert("네트워크 오류가 발생했습니다.");
    }

    // 로그아웃 성공 및 실패 시 로컬 스토리지 삭제 후 이동
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
});
