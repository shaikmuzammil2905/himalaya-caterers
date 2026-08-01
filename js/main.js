/* ==========================================================================
   Himalaya Caterers - Interactive Core Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Header Scroll & Active Link Handling
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
      backToTopBtn?.classList.add('visible');
    } else {
      header?.classList.remove('scrolled');
      backToTopBtn?.classList.remove('visible');
    }
  });

  backToTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Drawer Toggle
     ------------------------------------------------------------------------ */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const navBackdrop = document.querySelector('.nav-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileNavOverlay?.classList.add('active');
    navBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileNavOverlay?.classList.remove('active');
    navBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', () => {
    if (mobileNavOverlay?.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  navBackdrop?.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ------------------------------------------------------------------------
     3. Scroll Reveal Animations (Intersection Observer)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.fade-up, .fade-in');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------------
     4. Animated Statistics Counter
     ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasCounted = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const targetStr = stat.getAttribute('data-target') || '0';
      const isDecimal = targetStr.includes('.');
      const hasPlus = targetStr.includes('+');
      const targetNum = parseFloat(targetStr.replace(/[^0-9.]/g, ''));
      
      let startNum = 0;
      const duration = 2000;
      const steps = 60;
      const increment = targetNum / steps;
      const stepTime = duration / steps;

      const timer = setInterval(() => {
        startNum += increment;
        if (startNum >= targetNum) {
          startNum = targetNum;
          clearInterval(timer);
        }

        if (isDecimal) {
          stat.textContent = startNum.toFixed(1) + (targetStr.includes('/5') ? '/5' : '');
        } else {
          const formatted = Math.floor(startNum).toLocaleString();
          stat.textContent = formatted + (hasPlus ? '+' : '');
        }
      }, stepTime);
    });
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
          hasCounted = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  /* ------------------------------------------------------------------------
     5. Services Carousel Navigation (Mobile & Desktop arrows)
     ------------------------------------------------------------------------ */
  const servicesGrid = document.querySelector('.services-grid');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (servicesGrid) {
    prevBtn?.addEventListener('click', () => {
      servicesGrid.scrollBy({ left: -280, behavior: 'smooth' });
    });

    nextBtn?.addEventListener('click', () => {
      servicesGrid.scrollBy({ left: 280, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     6. Modal Popup System ("Get a Quote" / "Book Now" & "View Menu")
     ------------------------------------------------------------------------ */
  const quoteModal = document.getElementById('quoteModal');
  const menuModal = document.getElementById('menuModal');
  
  const triggerQuoteBtns = document.querySelectorAll('.js-open-quote');
  const triggerMenuBtns = document.querySelectorAll('.js-open-menu');
  const closeModalBtns = document.querySelectorAll('.modal-close, .modal-backdrop');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggerQuoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(quoteModal);
    });
  });

  triggerMenuBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(menuModal);
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(quoteModal);
      closeModal(menuModal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(quoteModal);
      closeModal(menuModal);
    }
  });

  /* Menu Tab Switching */
  const menuTabBtns = document.querySelectorAll('.menu-tab-btn');
  const menuCategories = document.querySelectorAll('.menu-category-content');

  menuTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-tab');

      menuTabBtns.forEach(b => b.classList.remove('active'));
      menuCategories.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetCategory)?.classList.add('active');
    });
  });

  /* ------------------------------------------------------------------------
     7. Booking Form Submission & Toast Notification
     ------------------------------------------------------------------------ */
  const bookingForm = document.getElementById('bookingForm');
  const toast = document.getElementById('toastNotification');

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value;
    const phone = document.getElementById('formPhone').value;

    if (!name || !phone) {
      showToast('⚠️ Please enter your Name and Phone Number.');
      return;
    }

    closeModal(quoteModal);
    showToast(`🎉 Thank you, ${name}! Your booking inquiry has been received. We will contact you at ${phone} shortly!`);
    bookingForm.reset();
  });

});
