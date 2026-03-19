'use strict';

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// SIDEBAR
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
}

// TESTIMONIALS MODAL
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

const testimonialsModalFunc = function () {
  modalContainer?.classList.toggle("active");
  overlay?.classList.toggle("active");
};

testimonialsItem.forEach(item => {
  item.addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
});

modalCloseBtn?.addEventListener("click", testimonialsModalFunc);
overlay?.addEventListener("click", testimonialsModalFunc);

// CUSTOM SELECT FILTER
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  filterItems.forEach(item => {
    item.classList.toggle("active", selectedValue === "all" || selectedValue === item.dataset.category);
  });
};

select?.addEventListener("click", function () {
  elementToggleFunc(this);
});

selectItems.forEach(item => {
  item.addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
});

// filterBtn large screen
let lastClickedBtn = filterBtn[0];
filterBtn.forEach(btn => {
  btn.addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
});

// CONTACT FORM
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

formInputs.forEach(input => {
  input.addEventListener("input", function () {
    if (form?.checkValidity()) {
      formBtn?.removeAttribute("disabled");
    } else {
      formBtn?.setAttribute("disabled", "");
    }
  });
});

// PAGE NAVIGATION (legacy - kept for compatibility)
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach((link, index) => {
  link.addEventListener("click", function () {
    const pageName = this.innerText.toLowerCase();
    pages.forEach((page, i) => {
      const match = page.dataset.page === pageName;
      page.classList.toggle("active", match);
      navigationLinks[i]?.classList.toggle("active", match);
    });
    window.scrollTo(0, 0);
  });
});

// =============================================
// SLIDE NAVIGATION
// =============================================
(function () {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const labels = document.querySelectorAll(".slide-label");
  const prevBtn = document.querySelector(".slide-arrow--prev");
  const nextBtn = document.querySelector(".slide-arrow--next");

  if (!slides.length) return;

  let current = 0;
  let isAnimating = false;
  const ANIM_DURATION = 680; // ms — matches CSS transition

  function goTo(n) {
    if (isAnimating || n === current || n < 0 || n >= slides.length) return;
    isAnimating = true;

    slides.forEach((slide, i) => {
      if (i < n)       slide.dataset.state = "prev";
      else if (i === n) slide.dataset.state = "active";
      else             slide.dataset.state = "next";
    });

    dots.forEach((d, i) => d.classList.toggle("active", i === n));
    labels.forEach((l, i) => l.classList.toggle("active", i === n));

    // Update arrow visibility
    if (prevBtn) prevBtn.classList.toggle("hidden", n === 0);
    if (nextBtn) nextBtn.classList.toggle("hidden", n === slides.length - 1);

    current = n;
    setTimeout(() => { isAnimating = false; }, ANIM_DURATION);
  }

  // Init
  goTo(0);

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener("click", () => goTo(+dot.dataset.dot));
  });

  // Arrow clicks
  prevBtn?.addEventListener("click", () => goTo(current - 1));
  nextBtn?.addEventListener("click", () => goTo(current + 1));

  // Keyboard
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); goTo(current + 1); }
    if (e.key === "ArrowUp"   || e.key === "PageUp")   { e.preventDefault(); goTo(current - 1); }
  });

  // Mouse wheel (debounced)
  let wheelTimer = null;
  document.addEventListener("wheel", e => {
    e.preventDefault();
    if (wheelTimer) return;
    wheelTimer = setTimeout(() => { wheelTimer = null; }, 900);
    if (e.deltaY > 0) goTo(current + 1);
    else              goTo(current - 1);
  }, { passive: false });

  // Touch swipe
  let touchStartY = 0;
  document.addEventListener("touchstart", e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener("touchend", e => {
    const delta = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) goTo(current + 1);
    else           goTo(current - 1);
  }, { passive: true });

})();