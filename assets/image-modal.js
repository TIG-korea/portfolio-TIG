(() => {
  const STYLE_ID = "portfolio-image-modal-style";
  const MODAL_ID = "portfolio-image-modal";
  const MODAL_TITLE_ID = `${MODAL_ID}-title`;
  const MODAL_HELP_ID = `${MODAL_ID}-help`;
  const TRIGGER_HELP_ID = `${MODAL_ID}-trigger-help`;
  let activeOpener = null;
  let backgroundState = [];
  let previousBodyOverflow = "";

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      img[data-image-modal="true"] {
        cursor: zoom-in;
        touch-action: manipulation;
      }
      img[data-image-modal="true"]:focus-visible {
        outline: 3px solid #2563eb;
        outline-offset: 4px;
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
        overflow: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
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
      #${MODAL_ID} .image-modal-close:focus-visible,
      #${MODAL_ID} .image-modal-original:focus-visible {
        outline: 3px solid #93c5fd;
        outline-offset: 3px;
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
        margin: 0;
        color: #ffffff;
        font: 600 14px/1.5 "Noto Sans KR", sans-serif;
        text-align: center;
      }
      #${MODAL_ID} .image-modal-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 8px 12px;
      }
      #${MODAL_ID} .image-modal-help {
        margin: 0;
        color: rgba(255, 255, 255, 0.82);
        font: 500 12px/1.5 "Noto Sans KR", sans-serif;
        text-align: center;
      }
      #${MODAL_ID} .image-modal-original {
        display: inline-flex;
        align-items: center;
        min-height: 36px;
        padding: 7px 12px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 999px;
        color: #ffffff;
        font: 700 12px/1.4 "Noto Sans KR", sans-serif;
        text-decoration: none;
      }
      #${MODAL_ID} .image-modal-original:hover {
        background: rgba(255, 255, 255, 0.12);
      }
      .image-modal-sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
      @media (max-width: 640px) {
        #${MODAL_ID} {
          padding: 18px;
        }
        #${MODAL_ID} .image-modal-close {
          top: 8px;
          right: 8px;
        }
        #${MODAL_ID} img {
          max-height: calc(100vh - 190px);
          max-height: calc(100dvh - 190px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureTriggerHelp() {
    const existing = document.getElementById(TRIGGER_HELP_ID);
    if (existing) return existing;

    const help = document.createElement("span");
    help.id = TRIGGER_HELP_ID;
    help.className = "image-modal-sr-only";
    help.textContent = "Enter 또는 Space 키로 확대 이미지를 엽니다.";
    document.body.appendChild(help);
    return help;
  }

  function ensureModal() {
    const existing = document.getElementById(MODAL_ID);
    if (existing) return existing;

    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", MODAL_TITLE_ID);
    modal.setAttribute("aria-describedby", MODAL_HELP_ID);
    modal.innerHTML = `
      <div class="image-modal-panel">
        <h2 id="${MODAL_TITLE_ID}" class="image-modal-sr-only">이미지 크게 보기</h2>
        <button class="image-modal-close" type="button" aria-label="이미지 닫기">×</button>
        <img alt="" />
        <p class="image-modal-caption"></p>
        <div class="image-modal-actions">
          <p id="${MODAL_HELP_ID}" class="image-modal-help">Esc 키로 닫을 수 있습니다. 원본 보기에서 이미지를 더 확대할 수 있습니다.</p>
          <a class="image-modal-original" href="#" target="_blank" rel="noopener noreferrer">원본 이미지 보기</a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  function setBackgroundInert(modal) {
    backgroundState = Array.from(document.body.children)
      .filter((element) => element !== modal)
      .map((element) => ({
        element,
        ariaHidden: element.getAttribute("aria-hidden"),
        inert: element.hasAttribute("inert"),
      }));

    backgroundState.forEach(({ element }) => {
      element.setAttribute("inert", "");
      element.setAttribute("aria-hidden", "true");
    });
  }

  function restoreBackground() {
    backgroundState.forEach(({ element, ariaHidden, inert }) => {
      if (!element.isConnected) return;

      if (ariaHidden === null) {
        element.removeAttribute("aria-hidden");
      } else {
        element.setAttribute("aria-hidden", ariaHidden);
      }

      if (!inert) element.removeAttribute("inert");
    });
    backgroundState = [];
  }

  function getFocusableElements(modal) {
    return Array.from(
      modal.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hidden && element.getClientRects().length > 0);
  }

  function closeModal(modal) {
    if (modal.getAttribute("aria-hidden") === "true") return;

    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousBodyOverflow;
    restoreBackground();

    const opener = activeOpener;
    activeOpener = null;
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
  }

  function openModal(modal, image) {
    if (modal.getAttribute("aria-hidden") === "false") return;

    const modalImage = modal.querySelector("img");
    const caption = modal.querySelector(".image-modal-caption");
    const originalLink = modal.querySelector(".image-modal-original");
    const imageSource = image.currentSrc || image.src;
    const imageDescription = image.alt.trim();

    activeOpener = image;
    previousBodyOverflow = document.body.style.overflow;
    modalImage.src = imageSource;
    modalImage.alt = image.alt || "확대 이미지";
    caption.textContent = imageDescription;
    caption.hidden = !imageDescription;
    originalLink.href = imageSource;
    originalLink.setAttribute(
      "aria-label",
      `${imageDescription || "확대 이미지"} 원본을 새 탭에서 보기`,
    );
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".image-modal-close").focus();
    setBackgroundInert(modal);
  }

  function describeTrigger(image) {
    const descriptionIds = new Set(
      (image.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean),
    );
    descriptionIds.add(TRIGGER_HELP_ID);

    image.dataset.imageModal = "true";
    image.setAttribute("role", "button");
    image.setAttribute("tabindex", "0");
    image.setAttribute("aria-haspopup", "dialog");
    image.setAttribute("aria-controls", MODAL_ID);
    image.setAttribute("aria-keyshortcuts", "Enter Space");
    image.setAttribute("aria-label", `${image.alt.trim() || "이미지"} 크게 보기`);
    image.setAttribute("aria-describedby", Array.from(descriptionIds).join(" "));
  }

  function init() {
    ensureStyle();
    ensureTriggerHelp();
    const modal = ensureModal();
    const closeButton = modal.querySelector(".image-modal-close");

    document.querySelectorAll("img:not(#portfolio-image-modal img)").forEach((image) => {
      if (image.closest("a")) return;
      describeTrigger(image);
      image.addEventListener("click", () => openModal(modal, image));
      image.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openModal(modal, image);
      });
    });

    closeButton.addEventListener("click", () => closeModal(modal));
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
    document.addEventListener("keydown", (event) => {
      if (modal.getAttribute("aria-hidden") !== "false") return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeModal(modal);
        return;
      }

      if (event.key === "Tab") {
        const focusableElements = getFocusableElements(modal);
        if (!focusableElements.length) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const focusedElement = document.activeElement;

        if (!modal.contains(focusedElement)) {
          event.preventDefault();
          (event.shiftKey ? lastElement : firstElement).focus();
        } else if (event.shiftKey && focusedElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && focusedElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
