/**
 * Jaipur National University (JNU) - Engineering Landing Page JS
 * Optimized, modular, performant & mobile-friendly
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ===================================================================
  // 1. Hero Carousel Slider & Custom Controls
  // ===================================================================
  const heroCarouselEl = document.querySelector('#jnuHeroCarousel');
  const dots = document.querySelectorAll('.jnu-dot');
  const prevBtn = document.querySelector('#heroPrevBtn');
  const nextBtn = document.querySelector('#heroNextBtn');

  if (heroCarouselEl && window.bootstrap) {
    const heroCarousel = new bootstrap.Carousel(heroCarouselEl, {
      interval: 5000,
      pause: 'hover',
      wrap: true
    });

    // Update custom dots when slide changes
    heroCarouselEl.addEventListener('slide.bs.carousel', function (e) {
      dots.forEach((dot, index) => {
        if (index === e.to) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    });

    // Custom dots click handling
    dots.forEach((dot, index) => {
      dot.addEventListener('click', function () {
        heroCarousel.to(index);
      });
    });

    // Arrow navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        heroCarousel.prev();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        heroCarousel.next();
      });
    }
  }

  // ===================================================================
  // 2. Admission Form Submission & Validation
  // ===================================================================
  const admissionForm = document.getElementById('admissionInquiryForm');
  const formSuccess = document.getElementById('formSuccessMsg');

  if (admissionForm) {
    admissionForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const mobileNumber = document.getElementById('mobileNumber').value.trim();
      const email = document.getElementById('email').value.trim();
      const state = document.getElementById('state').value.trim();
      const city = document.getElementById('city').value.trim();
      const programme = document.getElementById('programme').value;

      if (!fullName || !mobileNumber || !email || !state || !city || !programme) {
        alert('Please fill in all the required fields before submitting.');
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      const cleanedPhone = mobileNumber.replace(/\D/g, '').slice(-10);
      if (cleanedPhone.length !== 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }

      const submitBtn = document.getElementById('formSubmitBtn');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Submitting...';

      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        admissionForm.reset();

        if (formSuccess) {
          formSuccess.style.display = 'block';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => {
            formSuccess.style.display = 'none';
          }, 6000);
        } else {
          alert('Thank you! Your inquiry has been submitted. A JNU Admissions counsellor will contact you shortly.');
        }
      }, 1200);
    });
  }

  // ===================================================================
  // 3. Academic Programs Tabs Switcher
  // ===================================================================
  const programTabs = document.querySelectorAll('.jnu-program-tab');
  const contentTitle = document.getElementById('programContentTitle');
  const contentSub = document.getElementById('programContentSub');
  const studentImg = document.getElementById('programStudentImg');
  const studentBadge = document.getElementById('programStudentBadge');
  const programCtaBtn = document.getElementById('programCtaBtn');
  const coursesGrid = document.getElementById('programCoursesGrid');

  const programData = {
    ug: {
      title: 'Under Graduate',
      subtitle: 'Build strong foundations with industry-aligned degree programs.',
      image: 'assets/images/student-ug.jpg',
      badge: 'Degree Programs',
      btnText: 'View Under Graduate programs',
      courses: [
        { name: 'B.Tech', dept: 'Engineering & Technology' },
        { name: 'BBA', dept: 'Management' },
        { name: 'BCA', dept: 'Computer Applications' },
        { name: 'B.Sc', dept: 'Science' },
        { name: 'B.Com', dept: 'Commerce' },
        { name: 'BA', dept: 'Humanities' }
      ]
    },
    pg: {
      title: 'Post Graduate',
      subtitle: "Advance your expertise with master's degrees built for leadership and innovation.",
      image: 'assets/images/student-pg.jpg',
      badge: "Master's Programs",
      btnText: 'View Post Graduate programs',
      courses: [
        { name: 'M.Tech', dept: 'CSE / AI & Robotics / VLSI' },
        { name: 'MBA', dept: 'Business & Tech Analytics' },
        { name: 'MCA', dept: 'Cloud Computing & DevOps' },
        { name: 'M.Sc', dept: 'Data Science & Cyber Tech' },
        { name: 'M.Com', dept: 'Financial Engineering' },
        { name: 'MA', dept: 'Media & Global Relations' }
      ]
    },
    doc: {
      title: 'Doctoral Programs',
      subtitle: 'Conduct high-impact research with fully funded fellowships and state-of-the-art labs.',
      image: 'assets/images/student-phd.jpg',
      badge: 'Research Programs',
      btnText: 'View Doctoral programs',
      courses: [
        { name: 'Ph.D.', dept: 'Computer Science & Engineering' },
        { name: 'Ph.D.', dept: 'Electronics & Communication' },
        { name: 'Ph.D.', dept: 'Mechanical & Automation' },
        { name: 'Ph.D.', dept: 'Civil & Smart Infrastructure' },
        { name: 'Ph.D.', dept: 'Applied Sciences & Nanotech' },
        { name: 'Ph.D.', dept: 'Management & Tech Innovation' }
      ]
    }
  };

  if (programTabs.length && contentTitle && coursesGrid) {
    programTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const tabKey = this.getAttribute('data-tab');
        const data = programData[tabKey];
        if (!data) return;

        programTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const displayCard = document.querySelector('.jnu-program-display-card');
        if (displayCard) {
          displayCard.style.opacity = '0.5';
          displayCard.style.transition = 'opacity 0.2s ease';
        }

        setTimeout(() => {
          contentTitle.textContent = data.title;
          contentSub.textContent = data.subtitle;
          if (studentImg) studentImg.src = data.image;
          if (studentBadge) studentBadge.textContent = data.badge;
          if (programCtaBtn) {
            programCtaBtn.innerHTML = `<span>${data.btnText}</span> <i class="bi bi-arrow-right"></i>`;
          }

          let coursesHtml = '';
          data.courses.forEach(c => {
            coursesHtml += `
              <div class="col-12 col-sm-6">
                <div class="jnu-course-chip">
                  <div class="jnu-course-name">${c.name}</div>
                  <div class="jnu-course-dept">${c.dept}</div>
                </div>
              </div>
            `;
          });
          coursesGrid.innerHTML = coursesHtml;

          if (displayCard) {
            displayCard.style.opacity = '1';
          }
        }, 150);
      });
    });
  }

  // ===================================================================
  // 4. Ph.D. Programmes Dynamic Showcase
  // ===================================================================
  const phdCards = document.querySelectorAll('.jnu-phd-item-card');
  const phdShowcaseImg = document.getElementById('phdShowcaseImg');
  const phdShowcaseBadgeCat = document.getElementById('phdShowcaseBadgeCat');
  const phdShowcaseBadgeDuration = document.getElementById('phdShowcaseBadgeDuration');
  const phdShowcaseTitle = document.getElementById('phdShowcaseTitle');
  const phdShowcaseSubtag = document.getElementById('phdShowcaseSubtag');
  const phdShowcaseEligibility = document.getElementById('phdShowcaseEligibility');
  const phdShowcaseSelection = document.getElementById('phdShowcaseSelection');
  const phdShowcaseNoteBox = document.getElementById('phdShowcaseNoteBox');
  const phdShowcaseNote = document.getElementById('phdShowcaseNote');

  const phdData = {
    '1': {
      title: 'Ph.D. Computer Science and Engineering',
      subtag: 'Programme: Ph.D. Computer Science',
      category: 'engineering',
      categoryLabel: 'Engineering & CS',
      duration: 'Minimum 3 Years',
      eligibility: 'M.Tech with minimum 55% marks',
      selection: 'University Entrance Test or Direct Admission for NET-qualified candidates',
      note: '',
      image: 'assets/images/infra-research.jpg'
    },
    '2': {
      title: 'Ph.D. Electronics and Communication',
      subtag: '',
      category: 'engineering',
      categoryLabel: 'Engineering',
      duration: 'Minimum 3 Years',
      eligibility: 'M.Tech with minimum 55% marks',
      selection: 'University Entrance Test or Direct Admission for NET-qualified candidates',
      note: '',
      image: 'assets/images/infra-robotics.jpg'
    },
    '3': {
      title: 'Ph.D. in Computer Science',
      subtag: '',
      category: 'engineering',
      categoryLabel: 'Computer Science',
      duration: '3 Years',
      eligibility: 'Postgraduate degree with a minimum of 55% marks in the relevant field',
      selection: 'Entrance Test and Personal Interview. The process may also include a research orientation writing assignment.',
      note: '',
      image: 'assets/images/infra-digital.jpg'
    },
    '4': {
      title: 'Ph.D. Pharmaceutical Sciences',
      subtag: '',
      category: 'sciences',
      categoryLabel: 'Pharmaceutical Sciences',
      duration: '3 Years',
      eligibility: 'M.Pharm in any specialisation with a minimum of 55% marks or equivalent CGPA from PCI-recognised institutions/universities.',
      selection: 'Entrance Exam + Personal Interview',
      note: '',
      image: 'assets/images/usp-research.jpg'
    },
    '5': {
      title: 'Ph.D. English',
      subtag: '',
      category: 'arts',
      categoryLabel: 'Humanities & Arts',
      duration: 'Minimum 3 Years',
      eligibility: 'Postgraduation in English',
      selection: 'Entrance Test + Personal Interview',
      note: 'Lab and Library fees will be charged separately.',
      image: 'assets/images/infra-library.jpg'
    },
    '6': {
      title: 'Ph.D. Business & Management',
      subtag: '',
      category: 'arts',
      categoryLabel: 'Management',
      duration: 'Minimum 3 Years',
      eligibility: 'Postgraduation in Management, Commerce and Economics',
      selection: 'University Entrance Test or Direct Admission for NET-qualified candidates',
      note: '',
      image: 'assets/images/infra-design.jpg'
    },
    '7': {
      title: 'Ph.D. Education',
      subtag: '',
      category: 'arts',
      categoryLabel: 'Education',
      duration: 'Minimum 3 Years',
      eligibility: "1-Year/2-Semester or 2-Year/4-Semester Master's Degree Programme (M.A. Education/M.Ed.) with at least 55% marks in aggregate.",
      selection: 'University Entrance Test or Direct Admission for NET-qualified candidates',
      note: 'A relaxation of 5% marks is applicable to SC/ST/OBC (Non-Creamy Layer), Differently-Abled, Economically Weaker Section (EWS) and other eligible categories, as per UGC regulations.',
      image: 'assets/images/student-phd.jpg'
    },
    '8': {
      title: 'Ph.D. Life Sciences',
      subtag: '',
      category: 'sciences',
      categoryLabel: 'Life Sciences',
      duration: '3 Years',
      eligibility: 'Postgraduation in a relevant field with a minimum of 55% marks. 5% relaxation for SC/ST candidates.',
      selection: 'Entrance Test + Personal Interview',
      note: '5% relaxation for SC/ST candidates.',
      image: 'assets/images/usp-research.jpg'
    },
    '9': {
      title: 'Ph.D. Biotechnology',
      subtag: '',
      category: 'sciences',
      categoryLabel: 'Biotechnology',
      duration: '3 Years',
      eligibility: 'Postgraduation in a relevant field with a minimum of 55% marks. 5% relaxation for SC/ST candidates.',
      selection: 'Entrance Test + Personal Interview',
      note: '5% relaxation for SC/ST candidates.',
      image: 'assets/images/infra-research.jpg'
    },
    '10': {
      title: 'Ph.D. Microbiology',
      subtag: '',
      category: 'sciences',
      categoryLabel: 'Microbiology',
      duration: '3 Years',
      eligibility: 'Postgraduation in a relevant field with a minimum of 55% marks. 5% relaxation for SC/ST candidates.',
      selection: 'Entrance Test + Personal Interview',
      note: '5% relaxation for SC/ST candidates.',
      image: 'assets/images/usp-research.jpg'
    },
    '11': {
      title: 'Ph.D. Bioinformatics',
      subtag: '',
      category: 'sciences',
      categoryLabel: 'Bioinformatics',
      duration: '3 Years',
      eligibility: 'Postgraduation in a relevant field with a minimum of 55% marks. 5% relaxation for SC/ST candidates.',
      selection: 'Entrance Test + Personal Interview',
      note: '5% relaxation for SC/ST candidates.',
      image: 'assets/images/infra-digital.jpg'
    },
    '12': {
      title: 'Ph.D. Botany',
      subtag: '',
      category: 'sciences',
      categoryLabel: 'Botany',
      duration: '3 Years',
      eligibility: 'Postgraduation in a relevant field with a minimum of 55% marks. 5% relaxation for SC/ST candidates.',
      selection: 'Entrance Test + Personal Interview',
      note: '5% relaxation for SC/ST candidates.',
      image: 'assets/images/usp-research.jpg'
    },
    '13': {
      title: 'Ph.D. Zoology',
      subtag: '',
      category: 'sciences',
      categoryLabel: 'Zoology',
      duration: '3 Years',
      eligibility: 'Postgraduation in a relevant field with a minimum of 55% marks. 5% relaxation for SC/ST candidates.',
      selection: 'Entrance Test + Personal Interview',
      note: '5% relaxation for SC/ST candidates.',
      image: 'assets/images/infra-research.jpg'
    },
    '14': {
      title: 'Ph.D. Mathematics',
      subtag: '',
      category: 'sciences',
      categoryLabel: 'Mathematics',
      duration: '3 Years',
      eligibility: 'Postgraduation in Mathematics with a minimum of 55% marks. 5% relaxation for SC/ST candidates.',
      selection: 'Entrance Test + Personal Interview',
      note: '5% relaxation for SC/ST candidates.',
      image: 'assets/images/infra-digital.jpg'
    },
    '15': {
      title: 'Ph.D. Physics',
      subtag: '',
      category: 'sciences',
      categoryLabel: 'Physics',
      duration: '3 Years',
      eligibility: 'Postgraduation in a relevant field with a minimum of 55% marks. 5% relaxation for SC/ST candidates.',
      selection: 'Entrance Test + Personal Interview',
      note: '5% relaxation for SC/ST candidates.',
      image: 'assets/images/infra-research.jpg'
    }
  };

  function updatePhdShowcase(id) {
    const data = phdData[id];
    if (!data) return;

    if (phdShowcaseImg) {
      phdShowcaseImg.style.opacity = '0.25';
      setTimeout(() => {
        phdShowcaseImg.src = data.image;
        phdShowcaseImg.style.opacity = '1';
      }, 130);
    }

    if (phdShowcaseBadgeCat) {
      phdShowcaseBadgeCat.innerHTML = `<i class="bi bi-mortarboard-fill"></i> ${data.categoryLabel}`;
    }
    if (phdShowcaseBadgeDuration) {
      phdShowcaseBadgeDuration.innerHTML = `<i class="bi bi-clock-fill"></i> ${data.duration}`;
    }
    if (phdShowcaseTitle) {
      phdShowcaseTitle.textContent = data.title;
    }
    if (phdShowcaseSubtag) {
      if (data.subtag) {
        phdShowcaseSubtag.textContent = data.subtag;
        phdShowcaseSubtag.style.display = 'inline-block';
      } else {
        phdShowcaseSubtag.style.display = 'none';
      }
    }
    if (phdShowcaseEligibility) {
      phdShowcaseEligibility.textContent = data.eligibility;
    }
    if (phdShowcaseSelection) {
      phdShowcaseSelection.textContent = data.selection;
    }
    if (phdShowcaseNoteBox && phdShowcaseNote) {
      if (data.note) {
        phdShowcaseNote.textContent = data.note;
        phdShowcaseNoteBox.style.display = 'flex';
      } else {
        phdShowcaseNoteBox.style.display = 'none';
      }
    }
  }

  if (phdCards.length) {
    phdCards.forEach(card => {
      card.addEventListener('click', function () {
        phdCards.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const id = this.getAttribute('data-phd-id');
        updatePhdShowcase(id);
      });
    });
  }

  // ===================================================================
  // 5. Global CTA Links (Form Anchors) -> Smooth Scroll with Focus
  // ===================================================================
  const formLinks = document.querySelectorAll('a[href="#admission-form-section"]');
  const heroFormSection = document.getElementById('admission-form-section');
  const fullNameInput = document.getElementById('fullName');

  if (formLinks.length && heroFormSection) {
    formLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();

        heroFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const formCard = document.querySelector('.jnu-form-card');
        if (formCard) {
          formCard.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
          formCard.style.boxShadow = '0 0 0 4px rgba(181, 39, 89, 0.35)';
          formCard.style.borderColor = 'var(--jnu-secondary-crimson)';
          setTimeout(() => {
            formCard.style.boxShadow = '';
            formCard.style.borderColor = '';
          }, 1600);
        }

        if (fullNameInput) {
          setTimeout(() => {
            fullNameInput.focus({ preventScroll: true });
          }, 700);
        }
      });
    });
  }

  // ===================================================================
  // 6. FAQ Section: Accordion Plus/Minus Toggle
  // ===================================================================
  const faqAccordion = document.getElementById('jnuFaqAccordion');
  if (faqAccordion) {
    const faqCollapses = faqAccordion.querySelectorAll('.accordion-collapse');

    faqCollapses.forEach(collapseEl => {
      collapseEl.addEventListener('show.bs.collapse', function () {
        const item = this.closest('.jnu-faq-item');
        if (item) {
          item.classList.add('active');
          const icon = item.querySelector('.jnu-faq-toggle-icon i');
          if (icon) {
            icon.className = 'bi bi-dash';
          }
        }
      });

      collapseEl.addEventListener('hide.bs.collapse', function () {
        const item = this.closest('.jnu-faq-item');
        if (item) {
          item.classList.remove('active');
          const icon = item.querySelector('.jnu-faq-toggle-icon i');
          if (icon) {
            icon.className = 'bi bi-plus';
          }
        }
      });
    });
  }

  // ===================================================================
  // 7. Statistics Section: Smooth Animated Counters
  // ===================================================================
  const statsSection = document.querySelector('#jnu-stats');
  const counters = document.querySelectorAll('.jnu-counter');

  if (statsSection && counters.length) {
    let hasAnimated = false;

    function startCounters() {
      if (hasAnimated) return;
      hasAnimated = true;

      counters.forEach(counter => {
        const target = Number(counter.dataset.target);
        const suffix = counter.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          // Ease-out quartic
          const easedProgress = 1 - Math.pow(1 - progress, 4);
          const currentValue = Math.floor(target * easedProgress);

          counter.textContent = currentValue.toLocaleString('en-IN') + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString('en-IN') + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }

    if ('IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startCounters();
            statsObserver.unobserve(statsSection);
          }
        });
      }, {
        threshold: 0.05
      });

      statsObserver.observe(statsSection);
    } else {
      startCounters();
    }
  }

  // ===================================================================
  // 8. Scroll Reveal Animations (Non-blocking, High Performance)
  // ===================================================================
  const revealElements = document.querySelectorAll('.jnu-reveal');
  if (revealElements.length) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('jnu-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px 80px 0px',
        threshold: 0.01
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('jnu-revealed'));
    }
  }

});
