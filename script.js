'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1');

const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// --------------Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//modern way
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

//OLD WAY
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Smooth btn scrolling

btnScrollTo.addEventListener('click', function (e) {
  //coordinates od the section 1
  const s1coords = section1.getBoundingClientRect();

  //OLD WAY OF SCROLLING SMOOTHLY
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //NEW WAT OF SCROLLING SMOOTHLY - NOT COMPATIBLE TO MANY BROWSERS
  section1.scrollIntoView({ behavior: 'smooth' });
});

//-------------- Page navigation

navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);

  //MAtching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//-------------------Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause = if a condition is true, return
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate tabs
  clicked.classList.add('operations__tab--active');

  //Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//----------------------------Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    //select parent and then children to get siblings
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Passing "arguments" to the handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//---------------- Sticky navigation

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  //same as entries[0]
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  //when is 0% in the intersection observer(like the viewport), the function is called
  threshold: 0,
  //the height of the navigation, so it gets a better effect
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//-------------------------------Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  //same as entries[0]
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//------------Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  //just one threshold = just one entry
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace src with data-src (better quality img)
  entry.target.src = entry.target.dataset.src;

  //it will remove lazy img just when img is loaded
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  //added root margin so the images will already be loaded when we achieve it
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//-------------------- Slides

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  //Functions
  const gotoSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    gotoSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    gotoSlide(curSlide);
    activateDot(curSlide);
  };

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const init = () => {
    gotoSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  //Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      //destructuring: same thing as on the top
      //const {slide} = e.target.dataset;

      gotoSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
