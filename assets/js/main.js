/**
 * Jaipur National University (JNU) - Engineering Landing Page JS
 * Optimized, modular, performant & mobile-friendly
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ===================================================================
  // 1. Hero Carousel Setup
  // ===================================================================
  const heroCarouselEl = document.querySelector('#jnuHeroCarousel');
  if (heroCarouselEl && window.bootstrap) {
    new bootstrap.Carousel(heroCarouselEl, {
      interval: false,
      ride: false,
      wrap: false
    });
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
  // 3. World-Class Infrastructure 5-Card Interactive Carousel
  // ===================================================================
  const infraStage = document.getElementById('infraCarouselStage');
  const infraCards = document.querySelectorAll('.jnu-infra-card');
  const infraPrevBtn = document.getElementById('infraCarouselPrev');
  const infraNextBtn = document.getElementById('infraCarouselNext');
  const infraContainer = document.getElementById('infraCarouselContainer');

  if (infraCards.length && infraStage) {
    let activeIndex = 2; // Default to 150+ Acre & Green Campus (Card index 2) as featured in mockup
    const totalCards = infraCards.length;
    let autoPlayTimer = null;
    let isHovered = false;

    function renderCarousel() {
      infraCards.forEach((card, idx) => {
        card.classList.remove('pos-0', 'pos-1', 'pos-2', 'pos-3', 'pos-4', 'card-active');
        const diff = (idx - activeIndex + totalCards) % totalCards;
        card.classList.add(`pos-${diff}`);
        if (diff === 0) {
          card.classList.add('card-active');
        }
      });
    }

    function nextSlide() {
      activeIndex = (activeIndex + 1) % totalCards;
      renderCarousel();
    }

    function prevSlide() {
      activeIndex = (activeIndex - 1 + totalCards) % totalCards;
      renderCarousel();
    }

    function goToSlide(idx) {
      activeIndex = idx % totalCards;
      renderCarousel();
    }

    if (infraNextBtn) {
      infraNextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    if (infraPrevBtn) {
      infraPrevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    // Direct card click interaction
    infraCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        const diff = (idx - activeIndex + totalCards) % totalCards;
        if (diff !== 0) {
          goToSlide(idx);
          resetAutoPlay();
        }
      });
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    infraStage.addEventListener('touchstart', (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchStartX = e.changedTouches[0].screenX;
      }
      stopAutoPlay();
    }, { passive: true });

    infraStage.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchEndX = e.changedTouches[0].screenX;
      }
      handleSwipe();
      startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Auto Play with hover pause
    function startAutoPlay() {
      stopAutoPlay();
      if (!isHovered) {
        autoPlayTimer = setInterval(nextSlide, 6500);
      }
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    if (infraContainer) {
      infraContainer.addEventListener('mouseenter', () => {
        isHovered = true;
        stopAutoPlay();
      });
      infraContainer.addEventListener('mouseleave', () => {
        isHovered = false;
        startAutoPlay();
      });
    }

    // Initial render
    renderCarousel();
    startAutoPlay();
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
      image: 'assets/images/comp&eng.webp'
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
      image: 'assets/images/ElectronicsandComm.webp'
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
      image: 'assets/images/ComputerScience.webp'
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
      image: 'assets/images/PharmaceuticalSciences.webp'
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
      image: 'assets/images/English.webp'
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
      image: 'assets/images/Business&Management.webp'
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
      image: 'assets/images/Education.webp'
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
      image: 'assets/images/LifeSciences.webp'
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
      image: 'assets/images/Biotechnology.webp'
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
      image: 'assets/images/Microbiology.webp'
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
      image: 'assets/images/Bioinformatics.webp'
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
      image: 'assets/images/Botany.webp'
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
      image: 'assets/images/Zoology.webp'
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
      image: 'assets/images/Mathematics.webp'
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
      image: 'assets/images/Physics.webp'
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
        card.classList.add('active');
        const id = card.getAttribute('data-phd-id');
        updatePhdShowcase(id);
      });
    });
  }

  
  // ===================================================================
  // 4b. Medical Sciences Programmes Dynamic Showcase
  // ===================================================================
  const medCards = document.querySelectorAll('.jnu-med-item-card');
  const medShowcaseImg = document.getElementById('medShowcaseImg');
  const medShowcaseBadgeCat = document.getElementById('medShowcaseBadgeCat');
  const medShowcaseBadgeDuration = document.getElementById('medShowcaseBadgeDuration');
  const medShowcaseTitle = document.getElementById('medShowcaseTitle');
  const medShowcaseSubtag = document.getElementById('medShowcaseSubtag');
  const medShowcaseEligibility = document.getElementById('medShowcaseEligibility');
  const medShowcaseSelection = document.getElementById('medShowcaseSelection');

  const medData = {
    '1': {
      title: 'MD Anatomy',
      subtag: 'Specialisation: Pre-Clinical Sciences',
      categoryLabel: 'Medical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized State/National Counselling.',
      image: 'assets/images/aton.webp'
    },
    '2': {
      title: 'MD Physiology',
      subtag: 'Specialisation: Pre-Clinical Sciences',
      categoryLabel: 'Medical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/phycho.webp'
    },
    '3': {
      title: 'MD Pathology',
      subtag: 'Specialisation: Diagnostic & Laboratory Medicine',
      categoryLabel: 'Medical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/Microbiology.webp'
    },
    '4': {
      title: 'MD Biochemistry',
      subtag: 'Specialisation: Clinical & Molecular Medicine',
      categoryLabel: 'Medical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/Bioinformatics.webp'
    },
    '5': {
      title: 'MD Pharmacology',
      subtag: 'Specialisation: Clinical Pharmacology & Therapeutics',
      categoryLabel: 'Medical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/pharmac.webp'
    },
    '6': {
      title: 'MD Forensic Medicine',
      subtag: 'Specialisation: Forensic Medicine & Toxicology',
      categoryLabel: 'Medical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/foren.webp'
    },
    '7': {
      title: 'MD Community Medicine',
      subtag: 'Specialisation: Preventive & Social Medicine',
      categoryLabel: 'Medical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/ResearchOrientedLearning.webp'
    },
    '8': {
      title: 'MD General Medicine',
      subtag: 'Specialisation: Internal & Clinical Medicine',
      categoryLabel: 'Clinical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/genMec.webp'
    },
    '9': {
      title: 'MD Pediatrics',
      subtag: 'Specialisation: Child Health & Neonatology',
      categoryLabel: 'Clinical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/LifeSciences.webp'
    },
    '10': {
      title: 'MD Respiratory Medicine',
      subtag: 'Specialisation: Pulmonology & Chest Medicine',
      categoryLabel: 'Clinical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/respiratory.webp'
    },
    '11': {
      title: 'MD Psychiatry',
      subtag: 'Specialisation: Mental Health & Behavioral Sciences',
      categoryLabel: 'Clinical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/psychiat.webp'
    },
    '12': {
      title: 'MD Skin and VD',
      subtag: 'Specialisation: Dermatology, Venereology & Leprosy',
      categoryLabel: 'Clinical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/skin.webp'
    },
    '13': {
      title: 'MS General Surgery',
      subtag: 'Specialisation: Operative & Surgical Sciences',
      categoryLabel: 'Surgical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/gener.webp'
    },
    '14': {
      title: 'MS Orthopedics',
      subtag: 'Specialisation: Orthopedic Surgery & Trauma',
      categoryLabel: 'Surgical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/ortho.webp'
    },
    '15': {
      title: 'MS ENT',
      subtag: 'Specialisation: Otorhinolaryngology (ENT)',
      categoryLabel: 'Surgical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/ent.webp'
    },
    '16': {
      title: 'MS Ophthalmology',
      subtag: 'Specialisation: Ophthalmic Surgery & Eye Care',
      categoryLabel: 'Surgical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/ophtham.webp'
    },
    '17': {
      title: 'MS Obstetrics & Gynecology',
      subtag: 'Specialisation: Maternal Health & Gynecological Surgery',
      categoryLabel: 'Surgical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/obstet.webp'
    },
    '18': {
      title: 'MD Anaesthesia',
      subtag: 'Specialisation: Critical Care & Pain Medicine',
      categoryLabel: 'Clinical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/anaest.webp'
    },
    '19': {
      title: 'MD Radiodiagnosis',
      subtag: 'Specialisation: Diagnostic Imaging & Interventional Radiology',
      categoryLabel: 'Clinical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/rodio.webp'
    },
    '20': {
      title: 'MD Emergency Medicine',
      subtag: 'Specialisation: Acute Care & Trauma Management',
      categoryLabel: 'Clinical Sciences',
      duration: '3 Years',
      eligibility: 'MBBS degree recognized by NMC/MCI with completed compulsory rotatory internship.',
      selection: 'NEET-PG Merit Ranking & Centralized Counselling.',
      image: 'assets/images/emerg.webp'
    }
  };

  function updateMedShowcase(id) {
    const data = medData[id];
    if (!data) return;

    if (medShowcaseImg) {
      medShowcaseImg.style.opacity = '0.25';
      setTimeout(() => {
        medShowcaseImg.src = data.image;
        medShowcaseImg.style.opacity = '1';
      }, 130);
    }

    if (medShowcaseBadgeCat) {
      medShowcaseBadgeCat.innerHTML = `<i class="bi bi-heart-pulse-fill"></i> ${data.categoryLabel}`;
    }
    if (medShowcaseBadgeDuration) {
      medShowcaseBadgeDuration.innerHTML = `<i class="bi bi-clock-fill"></i> ${data.duration}`;
    }
    if (medShowcaseTitle) {
      medShowcaseTitle.textContent = data.title;
    }
    if (medShowcaseSubtag) {
      if (data.subtag) {
        medShowcaseSubtag.textContent = data.subtag;
        medShowcaseSubtag.style.display = 'inline-block';
      } else {
        medShowcaseSubtag.style.display = 'none';
      }
    }
    if (medShowcaseEligibility) {
      medShowcaseEligibility.textContent = data.eligibility;
    }
    if (medShowcaseSelection) {
      medShowcaseSelection.textContent = data.selection;
    }
  }

  if (medCards.length) {
    medCards.forEach(card => {
      card.addEventListener('click', function () {
        medCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const id = card.getAttribute('data-med-id');
        updateMedShowcase(id);
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

  // ===================================================================
  // 9. Why Choose JNU - Doctoral Research Tabs Interactivity
  // ===================================================================
  const whyTabs = document.querySelectorAll('.jnu-why-tab');
  const whyPanels = document.querySelectorAll('.jnu-why-panel');
  const tabsWrap = document.querySelector('.jnu-why-tabs-wrap');
  const whyCampusImg = document.getElementById('whyCampusImg');

  const whyImages = {
    '1': 'assets/images/DiverseResearchDomains.webp',
    '2': 'assets/images/ResearchOrientedLearning.webp',
    '3': 'assets/images/MultidisciplinaryAcademicEnvironment.webp',
    '4': 'assets/images/AcademicandResearchDevelopment.webp',
    '5': 'assets/images/FlexibleResearchExploration.webp'
  };

  // Preload Why Choose JNU images for instant switching
  Object.values(whyImages).forEach(src => {
    const preloadImg = new Image();
    preloadImg.src = src;
  });

  if (whyTabs.length && whyPanels.length) {
    function switchWhyTab(targetTab) {
      const tabNum = targetTab.getAttribute('data-why-tab');
      if (!tabNum) return;

      // Update tab buttons
      whyTabs.forEach(t => {
        const isActive = t === targetTab;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update panels
      whyPanels.forEach(p => {
        const pId = p.id;
        const isMatch = pId === 'why-panel-' + tabNum;
        p.classList.toggle('active', isMatch);
      });

      // Update image dynamically with smooth fade
      if (whyCampusImg) {
        const newImgSrc = targetTab.getAttribute('data-why-img') || whyImages[tabNum];
        if (newImgSrc && !whyCampusImg.src.endsWith(newImgSrc)) {
          whyCampusImg.style.opacity = '0.25';
          setTimeout(() => {
            whyCampusImg.src = newImgSrc;
            const tabTitle = targetTab.querySelector('.jnu-why-tab-text');
            if (tabTitle) {
              whyCampusImg.alt = tabTitle.textContent.trim() + ' - Jaipur National University';
            }
            whyCampusImg.style.opacity = '1';
          }, 120);
        }
      }

      // On mobile/tablet, scroll active tab into view smoothly
      if (tabsWrap && window.innerWidth < 992) {
        targetTab.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }

    whyTabs.forEach(tab => {
      tab.addEventListener('click', () => switchWhyTab(tab));

      // Keyboard arrow navigation
      tab.addEventListener('keydown', (e) => {
        const tabList = Array.from(whyTabs);
        const index = tabList.indexOf(tab);
        let nextIndex = null;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          nextIndex = (index + 1) % tabList.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          nextIndex = (index - 1 + tabList.length) % tabList.length;
        }

        if (nextIndex !== null) {
          tabList[nextIndex].focus();
          switchWhyTab(tabList[nextIndex]);
        }
      });
    });
  }

});
