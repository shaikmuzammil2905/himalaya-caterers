/* ==========================================================================
   Himalaya Caterers - Multi-Page Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Header Scroll & Multi-Page Active Link Highlighting
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

  /* Auto-highlight active navigation link based on window location */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  allNavLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else if (!linkHref.startsWith('#')) {
      link.classList.remove('active');
    }
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
  }, { threshold: 0.1 });

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
    }, { threshold: 0.2 });
    statsObserver.observe(statsSection);
  }

  /* ------------------------------------------------------------------------
     5. Services Carousel Controls
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
     6. Modal Popup System
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
     7. Form Submission & Toast Notifications
     ------------------------------------------------------------------------ */
  const bookingForms = document.querySelectorAll('#bookingForm, #contactPageForm');
  const toast = document.getElementById('toastNotification');

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('input[type="text"]')?.value || 'Guest';
      const phone = form.querySelector('input[type="tel"]')?.value || '9666552435';

      closeModal(quoteModal);
      showToast(`🎉 Thank you, ${name}! Your inquiry has been sent. We will call you at ${phone} shortly!`);
      form.reset();
    });
  });

  /* ------------------------------------------------------------------------
     8. Gallery Filter Tabs & Video Lightbox Modal
     ------------------------------------------------------------------------ */
  const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');
  const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item');

  galleryTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      galleryTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'flex';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });
    });
  });

  /* Video Lightbox Modal Interactivity */
  const videoModal = document.getElementById('videoModal');
  const videoPlayerLocalModal = document.getElementById('videoPlayerLocalModal');
  const videoPlayerIframe = document.getElementById('videoPlayerIframe');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoCloseBtn = document.querySelector('.video-modal-close');
  const videoOverlayTriggers = document.querySelectorAll('.video-play-overlay');

  function openVideoModal(videoSrc, videoId, title) {
    if (!videoModal) return;

    if (videoSrc) {
      if (videoPlayerLocalModal) {
        videoPlayerLocalModal.src = videoSrc;
        videoPlayerLocalModal.style.display = 'block';
        videoPlayerLocalModal.play().catch(e => console.log('Autoplay handled:', e));
      }
      if (videoPlayerIframe) videoPlayerIframe.style.display = 'none';
    } else if (videoId) {
      if (videoPlayerIframe) {
        videoPlayerIframe.src = `https://drive.google.com/file/d/${videoId}/preview`;
        videoPlayerIframe.style.display = 'block';
      }
      if (videoPlayerLocalModal) videoPlayerLocalModal.style.display = 'none';
    }

    if (videoModalTitle) videoModalTitle.textContent = title || 'Himalaya Caterers Event Video';
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('active');
    if (videoPlayerLocalModal) {
      videoPlayerLocalModal.pause();
      videoPlayerLocalModal.src = '';
    }
    if (videoPlayerIframe) {
      videoPlayerIframe.src = '';
    }
    document.body.style.overflow = '';
  }

  videoOverlayTriggers.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      const videoBox = overlay.closest('.video-box');
      const videoSrc = videoBox?.getAttribute('data-video-src');
      const videoId = videoBox?.getAttribute('data-video-id');
      const title = videoBox?.querySelector('.gallery-title')?.textContent;
      openVideoModal(videoSrc, videoId, title);
    });
  });

  videoCloseBtn?.addEventListener('click', closeVideoModal);

  videoModal?.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeVideoModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal?.classList.contains('active')) {
      closeVideoModal();
    }
  });

  /* ------------------------------------------------------------------------
     9. Location Tabs Switching (Hyderabad & Karnataka)
     ------------------------------------------------------------------------ */
  const locationTabBtns = document.querySelectorAll('.location-tab-btn');
  const locationBoxes = document.querySelectorAll('.location-content-box');

  locationTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const locTarget = btn.getAttribute('data-loc');
      const parentSection = btn.closest('.contact-map-section');
      if (!parentSection) return;

      const sectionBtns = parentSection.querySelectorAll('.location-tab-btn');
      const sectionBoxes = parentSection.querySelectorAll('.location-content-box');

      sectionBtns.forEach(b => b.classList.remove('active'));
      sectionBoxes.forEach(box => box.classList.remove('active'));

      btn.classList.add('active');
      parentSection.querySelector(`#loc-${locTarget}`)?.classList.add('active');
    });
  });

});

