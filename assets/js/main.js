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
  // 4. Infrastructure Dynamic Showcase
  // ===================================================================
  const infraItems = document.querySelectorAll('.jnu-infra-item-card');
  const showcaseImg = document.getElementById('infraShowcaseImg');
  const showcaseBadge = document.getElementById('infraShowcaseBadge');
  const showcaseTitle = document.getElementById('infraShowcaseTitle');
  const showcaseDesc = document.getElementById('infraShowcaseDesc');

  const infraData = {
    '1': {
      title: 'Design & Innovation Studio',
      badge: 'RESEARCH IN ACTION',
      desc: 'Next-generation prototyping, 3D printing and engineering development spaces equipped with industry-standard toolsets.',
      image: 'assets/images/infra-design.jpg'
    },
    '2': {
      title: 'Research Laboratories & AI Hub',
      badge: 'ADVANCED COMPUTING',
      desc: 'High-end GPU workstations and dedicated AI clusters designed for deep learning, NLP, and computer vision projects.',
      image: 'assets/images/infra-research.jpg'
    },
    '3': {
      title: 'Digital Learning Hub',
      badge: 'SMART CLASSROOMS',
      desc: 'Interactive digital amphitheaters with hybrid telepresence technology connecting global guest lecturers with students.',
      image: 'assets/images/infra-digital.jpg'
    },
    '4': {
      title: 'Biotechnology & Nanotech Lab',
      badge: 'BIOTECH RESEARCH',
      desc: 'Specialized sterile chambers, spectrophotometers, and PCR equipment for molecular biology and bio-engineering research.',
      image: 'assets/images/infra-research.jpg'
    },
    '5': {
      title: 'Robotics & Automation Center',
      badge: 'INDUSTRY 4.0 LAB',
      desc: 'Industrial robotic arms, PLC automation benches, and IoT sensor arrays for Mechatronics and Automation engineering.',
      image: 'assets/images/infra-robotics.jpg'
    },
    '6': {
      title: 'Engineering Workshop',
      badge: 'PRECISION FABRICATION',
      desc: 'Heavy machining, CNC tooling, casting, and advanced welding facilities fostering hands-on practical fabrication skills.',
      image: 'assets/images/infra-design.jpg'
    },
    '7': {
      title: 'High-Performance Computing Center',
      badge: 'SUPERCOMPUTING LAB',
      desc: 'Massive parallel computing clusters supporting intensive computational simulation, finite element modeling, and big data.',
      image: 'assets/images/infra-digital.jpg'
    },
    '8': {
      title: 'Cyber Security & Forensics Lab',
      badge: 'THREAT SIMULATION LAB',
      desc: 'Air-gapped security testbeds for ethical hacking, digital forensics, network vulnerability assessment, and threat hunting.',
      image: 'assets/images/infra-robotics.jpg'
    },
    '9': {
      title: 'Central Digital Library',
      badge: 'KNOWLEDGE COMMONS',
      desc: 'Over 100,000 volumes, access to IEEE, Springer, and ScienceDirect journals with dedicated quiet research pods.',
      image: 'assets/images/infra-library.jpg'
    },
    '10': {
      title: 'Sports Complex & Student Arena',
      badge: 'CAMPUS LIFE & FITNESS',
      desc: 'Olympic-size running track, indoor badminton and basketball courts, gymnasium, and sports pavilion for physical wellness.',
      image: 'assets/images/infra-sports.jpg'
    }
  };

  if (infraItems.length && showcaseImg && showcaseTitle) {
    infraItems.forEach(card => {
      card.addEventListener('click', function () {
        const id = this.getAttribute('data-infra-id');
        const data = infraData[id];
        if (!data) return;

        infraItems.forEach(c => c.classList.remove('active'));
        this.classList.add('active');

        showcaseImg.style.opacity = '0.3';
        setTimeout(() => {
          showcaseImg.src = data.image;
          if (showcaseBadge) showcaseBadge.innerHTML = `<i class="bi bi-circle-fill" style="font-size: 6px;"></i> ${data.badge}`;
          showcaseTitle.textContent = data.title;
          if (showcaseDesc) showcaseDesc.textContent = data.desc;
          showcaseImg.style.opacity = '1';
        }, 150);
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
