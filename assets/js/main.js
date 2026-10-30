/**
 * Jaipur National University (JNU) - Engineering Landing Page JS
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize Bootstrap Carousel for Hero Banner
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

  // Handle Form Submission with Validation
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

      // Simple Validation
      if (!fullName || !mobileNumber || !email || !state || !city || !programme) {
        alert('Please fill in all the required fields before submitting.');
        return;
      }

      // Basic Phone validation
      const phoneRegex = /^[0-9]{10}$/;
      const cleanedPhone = mobileNumber.replace(/\D/g, '').slice(-10);
      if (cleanedPhone.length !== 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }

      // Form submission feedback
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
  // Program Section Tabs Switcher
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

        // Update active class
        programTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        // Animate content update
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

          // Rebuild courses grid
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
  // Infrastructure Section 10 Cards Interactive Preview
  // ===================================================================
  // ===================================================================
  // Section 5: Infrastructure Dynamic Showcase
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

        // Active class
        infraItems.forEach(c => c.classList.remove('active'));
        this.classList.add('active');

        // Smooth update
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
  // Form CTA Links (Navbar, Placements CTA, FAQ) -> Smooth Scroll
  // ===================================================================
  const formLinks = document.querySelectorAll('a[href="#admission-form-section"]');
  const heroFormSection = document.getElementById('admission-form-section');
  const fullNameInput = document.getElementById('fullName');

  if (formLinks.length && heroFormSection) {
    formLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Smooth scroll cleanly to the hero admission inquiry form
        heroFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Gentle highlight animation on form card
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

        // Focus without forcing secondary scroll jumping
        if (fullNameInput) {
          setTimeout(() => {
            fullNameInput.focus({ preventScroll: true });
          }, 700);
        }
      });
    });
  }

  // ===================================================================
  // Testimonials Section: Interactive Student Card & Detail Switcher
  // ===================================================================
  const testiCards = document.querySelectorAll('.jnu-testi-card');
  const testiDetailImg = document.getElementById('testiDetailImg');
  const testiCounter = document.getElementById('testiCounter');
  const testiDetailName = document.getElementById('testiDetailName');
  const testiDetailDeg = document.getElementById('testiDetailDeg');
  const testiDetailQuote = document.getElementById('testiDetailQuote');
  const testiDetailCompany = document.getElementById('testiDetailCompany');
  const testiDetailRole = document.getElementById('testiDetailRole');
  const testiPrevBtn = document.getElementById('testiPrevBtn');
  const testiNextBtn = document.getElementById('testiNextBtn');

  const testiData = {
    '1': {
      counter: '01 / 06',
      name: 'Ms. Pratika Gupta',
      degree: 'B.Tech Biotechnology',
      quote: 'As a B.Tech Biotechnology student at JNU, my journey has been transformative. The comprehensive curriculum and supportive faculty have deepened my understanding of biotechnology. Workshops, industrial visits, and extracurricular activities have bridged theory with practice and boosted my confidence, preparing me for future challenges in the field.',
      company: 'Deloitte.',
      role: 'Consultant',
      image: 'assets/images/testi-featured-pratika.jpg'
    },
    '2': {
      counter: '02 / 06',
      name: 'Mr. Tarun Sharma',
      degree: 'B.Tech Computer Science',
      quote: 'JNU helped me enhance my technical skills and provided industry exposure from day one. Working in specialized AI and Cloud laboratories gave me the confidence to build real-world software architectures. The professors mentored me personally for competitive hackathons and coding tournaments.',
      company: 'Google',
      role: 'Software Engineer',
      image: 'assets/images/testi-student-2.jpg'
    },
    '3': {
      counter: '03 / 06',
      name: 'Mr. Mohd. Burhan',
      degree: 'B.Tech Computer Science',
      quote: 'A supportive environment to grow and learn through hands-on hackathons, research projects, and mentorship. The coding culture and guidance from professors shaped my career path completely and opened doors to leading global tech innovators.',
      company: 'Microsoft',
      role: 'Cloud Architect',
      image: 'assets/images/testi-student-3.jpg'
    },
    '4': {
      counter: '04 / 06',
      name: 'Ms. Sneha Gupta',
      degree: 'B.Tech IT',
      quote: 'The exposure and guidance at JNU helped me bridge the gap between classroom theory and real corporate environments. The mock interviews, corporate mentorship sessions, and placement bootcamps were game-changers that gave me clarity and confidence.',
      company: 'Amazon',
      role: 'Product Analyst',
      image: 'assets/images/testi-student-4.jpg'
    },
    '5': {
      counter: '05 / 06',
      name: 'Mr. Aditya Singh',
      degree: 'MBA',
      quote: 'JNU provided the right platform, people and opportunities to shape my career. The dual emphasis on business analytics and engineering management prepared me to lead cross-functional tech teams and solve high-impact industrial problems.',
      company: 'Accenture',
      role: 'Technology Analyst',
      image: 'assets/images/testi-student-5.jpg'
    },
    '6': {
      counter: '06 / 06',
      name: 'Ms. Neha Kapoor',
      degree: 'B.Tech ECE',
      quote: 'The skills and opportunities at JNU made my transition into the global corporate world smooth and rewarding. Working in advanced VLSI and IoT labs gave me a distinct edge in high-stakes interviews with multinational engineering leaders.',
      company: 'IBM',
      role: 'Data Analyst',
      image: 'assets/images/testi-student-6.jpg'
    }
  };

  let currentTestiId = 1;
  const totalTestis = 6;

  function setTestimonial(id) {
    const data = testiData[id];
    if (!data) return;

    currentTestiId = parseInt(id, 10);

    // Update active state on small cards
    testiCards.forEach(c => {
      if (c.getAttribute('data-testi-id') === String(id)) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    // Animate detail card content
    if (testiDetailImg) {
      testiDetailImg.style.opacity = '0.3';
      testiDetailImg.style.transform = 'scale(0.97)';
    }

    setTimeout(() => {
      if (testiDetailImg) {
        testiDetailImg.src = data.image;
        testiDetailImg.style.opacity = '1';
        testiDetailImg.style.transform = 'scale(1)';
      }
      if (testiCounter) testiCounter.textContent = data.counter;
      if (testiDetailName) testiDetailName.textContent = data.name;
      if (testiDetailDeg) testiDetailDeg.textContent = data.degree;
      if (testiDetailQuote) testiDetailQuote.textContent = data.quote;
      if (testiDetailCompany) testiDetailCompany.textContent = data.company;
      if (testiDetailRole) testiDetailRole.textContent = data.role;
    }, 180);
  }

  if (testiCards.length) {
    testiCards.forEach(card => {
      card.addEventListener('click', function () {
        const id = this.getAttribute('data-testi-id');
        setTestimonial(id);
      });
    });

    if (testiPrevBtn) {
      testiPrevBtn.addEventListener('click', function () {
        let prevId = currentTestiId - 1;
        if (prevId < 1) prevId = totalTestis;
        setTestimonial(prevId);
      });
    }

    if (testiNextBtn) {
      testiNextBtn.addEventListener('click', function () {
        let nextId = currentTestiId + 1;
        if (nextId > totalTestis) nextId = 1;
        setTestimonial(nextId);
      });
    }
  }

  // ===================================================================
  // FAQ Section: Accordion Active State & Plus/Minus Toggle
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
});


document.addEventListener("DOMContentLoaded", function () {

    const statsSection = document.querySelector("#jnu-stats");
    const counters = document.querySelectorAll(".jnu-counter");

    if (!statsSection || !counters.length) return;

    let hasAnimated = false;

    function startCounters() {

        if (hasAnimated) return;
        hasAnimated = true;

        counters.forEach(counter => {

            const target = Number(counter.dataset.target);
            const suffix = counter.dataset.suffix || "";
            const duration = 2200;
            const startTime = performance.now();

            function updateCounter(currentTime) {

                const progress = Math.min(
                    (currentTime - startTime) / duration,
                    1
                );

                // Smooth ease-out animation
                const easedProgress = 1 - Math.pow(1 - progress, 4);

                const currentValue = Math.floor(
                    target * easedProgress
                );

                counter.textContent =
                    currentValue.toLocaleString("en-IN") + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent =
                        target.toLocaleString("en-IN") + suffix;
                }
            }

            requestAnimationFrame(updateCounter);

        });
    }

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(statsSection);
            }

        });

    }, {
        threshold: 0.15
    });

    observer.observe(statsSection);

    // ===================================================================
    // Scroll Reveal Animations for All Sections (Mobile & Desktop)
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
            // Immediate fallback if IntersectionObserver not available
            revealElements.forEach(el => el.classList.add('jnu-revealed'));
        }
    }

});
