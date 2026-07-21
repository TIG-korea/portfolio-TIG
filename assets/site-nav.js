(function () {
  document.querySelectorAll("header details").forEach((menu) => {
    const summary = menu.querySelector("summary");
    if (!summary) return;

    const updateLabel = () => {
      summary.setAttribute("aria-label", menu.open ? "모바일 메뉴 닫기" : "모바일 메뉴 열기");
    };

    menu.addEventListener("toggle", updateLabel);
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.open = false;
      });
    });
    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.open) {
        menu.open = false;
        summary.focus();
      }
    });
    updateLabel();
  });
})();
