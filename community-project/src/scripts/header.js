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

  // 로그아웃 버튼 클릭 시 로컬 스토리지 삭제 후 로그인 페이지로 이동
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userData");
    window.location.href = "login.html";
  });
});
