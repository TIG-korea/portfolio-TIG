(() => {
  const STYLE_ID = "portfolio-image-modal-style";
  const MODAL_ID = "portfolio-image-modal";

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      img[data-image-modal="true"] {
        cursor: zoom-in;
      }
      #${MODAL_ID} {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 28px;
        background: rgba(12, 14, 18, 0.82);
      }
      #${MODAL_ID}[aria-hidden="false"] {
        display: flex;
      }
      #${MODAL_ID} .image-modal-panel {
        position: relative;
        display: grid;
        gap: 12px;
        width: min(1120px, 100%);
        max-height: calc(100vh - 56px);
      }
      #${MODAL_ID} .image-modal-close {
        position: absolute;
        top: -14px;
        right: -14px;
        width: 40px;
        height: 40px;
        border: 1px solid rgba(255, 255, 255, 0.36);
        border-radius: 50%;
        background: #ffffff;
        color: #111827;
        font-size: 22px;
        font-weight: 800;
        line-height: 1;
        cursor: pointer;
      }
      #${MODAL_ID} img {
        display: block;
        width: 100%;
        max-height: calc(100vh - 118px);
        object-fit: contain;
        border-radius: 8px;
        background: #ffffff;
      }
      #${MODAL_ID} .image-modal-caption {
        color: #ffffff;
        font: 600 14px/1.5 "Noto Sans KR", sans-serif;
        text-align: center;
      }
      @media (max-width: 640px) {
        #${MODAL_ID} {
          padding: 18px;
        }
        #${MODAL_ID} .image-modal-close {
          top: 8px;
          right: 8px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureModal() {
    const existing = document.getElementById(MODAL_ID);
    if (existing) return existing;

    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="image-modal-panel">
        <button class="image-modal-close" type="button" aria-label="이미지 닫기">×</button>
        <img alt="" />
        <p class="image-modal-caption"></p>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  function closeModal(modal) {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function openModal(modal, image) {
    const modalImage = modal.querySelector("img");
    const caption = modal.querySelector(".image-modal-caption");
    modalImage.src = image.currentSrc || image.src;
    modalImage.alt = image.alt || "확대 이미지";
    caption.textContent = image.alt || "";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".image-modal-close").focus();
  }

  function init() {
    ensureStyle();
    const modal = ensureModal();
    const closeButton = modal.querySelector(".image-modal-close");

    document.querySelectorAll("img:not(#portfolio-image-modal img)").forEach((image) => {
      image.dataset.imageModal = "true";
      image.addEventListener("click", () => openModal(modal, image));
    });

    closeButton.addEventListener("click", () => closeModal(modal));
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
        closeModal(modal);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
