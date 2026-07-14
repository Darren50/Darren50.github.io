// ===== theme toggle (initial theme is set inline in <head>) =====
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    if (dark) {
        delete document.documentElement.dataset.theme;
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.dataset.theme = 'dark';
        localStorage.setItem('theme', 'dark');
    }
});

// ===== nav: shadow on scroll =====
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== nav: mobile menu =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    })
);

// ===== nav: highlight the section in view =====
const sections = [...document.querySelectorAll('main section[id]')];
const linkFor = id => navLinks.querySelector(`a[href="#${id}"]`);
const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
        const link = linkFor(e.target.id);
        if (link && e.isIntersecting) {
            navLinks.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => spy.observe(s));

// ===== animations (GSAP + ScrollTrigger) =====
// Elements are only hidden from inside GSAP calls, so if the CDN ever fails
// the page simply renders static and fully visible.
if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // hero entrance (home page)
    if (document.querySelector('.hero')) {
        gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
            .from('.hero-kicker', { y: 30, autoAlpha: 0 }, 0.1)
            .from('.hero h1', { y: 46, autoAlpha: 0 }, 0.25)
            .from('.hero-sub', { y: 30, autoAlpha: 0 }, 0.45)
            .from('.hero-cta .btn', { y: 26, autoAlpha: 0, stagger: 0.12 }, 0.6)
            .from('.hero-meta .pill', { y: 18, autoAlpha: 0, stagger: 0.08 }, 0.75);
    }

    // case study pages: header drops in, article blocks rise as you read
    if (document.querySelector('.case')) {
        gsap.from('.case-hero > *', {
            y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12
        });
        gsap.utils.toArray('.case-article > *').forEach(el => {
            gsap.from(el, {
                y: 32, autoAlpha: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 92%', once: true }
            });
        });
    }

    // grid items reveal in staggered batches as they enter the viewport
    ['.course-group', '.project-card', '.skill-group', '.award'].forEach(sel => {
        gsap.set(sel, { autoAlpha: 0, y: 34 });
        ScrollTrigger.batch(sel, {
            start: 'top 90%',
            once: true,
            onEnter: els => gsap.to(els, {
                autoAlpha: 1, y: 0,
                duration: 0.8, ease: 'power3.out', stagger: 0.09
            })
        });
    });

    // language proficiency bars sweep in
    if (document.querySelector('.lang-fill')) {
        gsap.from('.lang-fill', {
            scaleX: 0, transformOrigin: 'left center',
            duration: 1.2, ease: 'power3.out', stagger: 0.2,
            scrollTrigger: { trigger: '.lang-list', start: 'top 90%', once: true }
        });
    }

    // skill chips pop in with a quick cascade
    gsap.set('.chip', { autoAlpha: 0, y: 14, scale: 0.9 });
    ScrollTrigger.batch('.chip', {
        start: 'top 92%',
        once: true,
        onEnter: els => gsap.to(els, {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 0.5, ease: 'back.out(1.7)', stagger: 0.035
        })
    });

    // single blocks slide up individually
    gsap.utils.toArray(
        '.section-head, .about-grid > *, .t-item > *:not(.coursework), .xp-card, .contact-info, .contact-form'
    ).forEach(el => {
        gsap.from(el, {
            y: 36, autoAlpha: 0, duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        });
    });

    // hero blobs drift away as you scroll
    gsap.to('.blob-1', { yPercent: 35, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.blob-2', { yPercent: -25, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.blob-3', { xPercent: 20, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
}

// ===== hero: typewriter word rotator =====
const WORDS = [
    'building web apps',
    'tinkering with robots',
    'exploring AI features',
    'solving LeetCode daily'
];
const wordEl = document.getElementById('rotatorWord');
if (wordEl) {
    let wordIdx = 0, charIdx = WORDS[0].length, deleting = true;

    // wait a beat on the initial word before cycling
    setTimeout(function tick() {
        const word = WORDS[wordIdx];
        charIdx += deleting ? -1 : 1;
        wordEl.textContent = word.slice(0, charIdx);

        let delay = deleting ? 40 : 70;
        if (!deleting && charIdx === word.length) {
            delay = 2200;              // pause on the full word
            deleting = true;
        } else if (deleting && charIdx === 0) {
            wordIdx = (wordIdx + 1) % WORDS.length;
            deleting = false;
            delay = 350;
        }
        setTimeout(tick, delay);
    }, 2200);
}
