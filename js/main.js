// ── i18n ─────────────────────────────────────────────────────
let currentLang = 'es';
let currentFreqIdx = 0;

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-es]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
  });
  document.querySelectorAll('[data-es-ph]').forEach(el => {
    el.placeholder = lang === 'es' ? el.dataset.esPh : el.dataset.enPh;
  });
  setFreq(currentFreqIdx);
}

// ── Scroll spy ───────────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav__links a');
const spySections = document.querySelectorAll('section[id]');

let spyLocked = false;
let spyLockTimer = null;

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    spyLocked = true;
    clearTimeout(spyLockTimer);
    spyLockTimer = setTimeout(() => { spyLocked = false; }, 700);
  });
});

const spyObserver = new IntersectionObserver((entries) => {
  if (spyLocked) return;
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-56px 0px -50% 0px', threshold: 0 });

spySections.forEach(s => spyObserver.observe(s));

// ── Language toggle ──────────────────────────────────────────
const langBtns = document.querySelectorAll('.nav__lang-opt');
langBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    langBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    localStorage.setItem('lang', btn.dataset.lang);
    applyLang(btn.dataset.lang);
  });
});

// ── Audio + Mute toggle ───────────────────────────────────────
const audio     = document.getElementById('bg-audio');
const btnMute   = document.getElementById('btn-mute');
const iconSound = document.getElementById('icon-sound');
const iconMute  = document.getElementById('icon-mute');
const muteLabel = btnMute.querySelector('.nav__mute-label');

audio.volume = 0.3;
audio.muted  = true;
let audioStarted = false;

function syncMuteUI() {
  const m = audio.muted;
  btnMute.setAttribute('aria-pressed', String(m));
  iconSound.style.display = m ? 'none'  : 'block';
  iconMute.style.display  = m ? 'block' : 'none';
  muteLabel.textContent   = m ? 'MUTE'  : 'UNMUTE';
}

function startAudio() {
  if (audioStarted) return;
  audioStarted = true;
  audio.play().catch(() => { audioStarted = false; });
}

syncMuteUI();

document.addEventListener('click', function onFirstClick() {
  startAudio();
}, { once: true });

btnMute.addEventListener('click', (e) => {
  e.stopPropagation();
  audio.muted = !audio.muted;
  syncMuteUI();
  if (!audio.muted) startAudio();
});

// ── TV Trinitron · click para reproducir ────────────────────
const tv = document.getElementById('hero-tv');
if (tv) {
  const toggleTV = () => tv.classList.toggle('tv--playing');
  tv.addEventListener('click', toggleTV);
  tv.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTV(); }
  });
}

// ── Cassette flip ────────────────────────────────────────────
document.querySelectorAll('.cassette').forEach(c => {
  const flip = e => { e.stopPropagation(); c.classList.toggle('flipped'); };
  c.addEventListener('click', flip);
  c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.classList.toggle('flipped'); } });
});

// ── Trabajos · expand ────────────────────────────────────────
document.querySelectorAll('.trabajos__item').forEach(item => {
  item.querySelector('.trabajos__row').addEventListener('click', () => {
    item.classList.toggle('open');
  });
});

// ── Viajes · banderas tooltip + navegación ───────────────────
const viajesNombres = {
  australia: 'Australia',
  indonesia:  'Indonesia',
  singapur:   'Singapur',
  malasia:    'Malasia',
  tailandia:  'Tailandia',
  vietnam:    'Vietnam',
  china:      'China',
  japon:      'Japón',
};

const viajesMapWrap = document.querySelector('.viajes__map-wrap');
const viajesToolTip = document.getElementById('viajes-tooltip');

if (viajesMapWrap && viajesToolTip) {
  document.querySelectorAll('.viajes__dest[data-dest]').forEach(dest => {
    const key = dest.dataset.dest;
    if (!viajesNombres[key]) return;

    dest.addEventListener('mouseenter', () => {
      viajesToolTip.textContent = viajesNombres[key];
      viajesToolTip.classList.add('visible');
    });

    dest.addEventListener('mousemove', e => {
      const rect = viajesMapWrap.getBoundingClientRect();
      viajesToolTip.style.left = (e.clientX - rect.left + 14) + 'px';
      viajesToolTip.style.top  = (e.clientY - rect.top  - 38) + 'px';
    });

    dest.addEventListener('mouseleave', () => {
      viajesToolTip.classList.remove('visible');
    });

    dest.addEventListener('click', () => {
      window.location.href = `destinos.html?pais=${key}`;
    });

    dest.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = `destinos.html?pais=${key}`;
      }
    });
  });
}

// ── Contacto · FM dial ────────────────────────────────────────
const freqs = [
  {
    mhz: '96.1',
    motivo:      { es: 'Proyecto',     en: 'Project'      },
    placeholder: { es: 'Contame sobre tu proyecto...',     en: 'Tell me about your project...'    },
    wa:          { es: 'Hola Ignacio, te contacto por un proyecto.',    en: 'Hi Ignacio, I am reaching out about a project.'   },
  },
  {
    mhz: '100.3',
    motivo:      { es: 'Colaboración', en: 'Collaboration' },
    placeholder: { es: 'Tengo una idea para colaborar...', en: 'I have an idea to collaborate...' },
    wa:          { es: 'Hola Ignacio, me gustaría colaborar con vos.', en: 'Hi Ignacio, I would like to collaborate with you.' },
  },
  {
    mhz: '104.7',
    motivo:      { es: 'Consulta',     en: 'Inquiry'      },
    placeholder: { es: 'Tengo una consulta...',             en: 'I have an inquiry...'             },
    wa:          { es: 'Hola Ignacio, quería hacerte una consulta.', en: 'Hi Ignacio, I have an inquiry for you.' },
  },
];

const freqDisplay = document.getElementById('freq-display');
const dialNeedle  = document.getElementById('dial-needle');
const motivoInput = document.getElementById('c-motivo');
const mensajeTxt  = document.getElementById('c-mensaje');
const mailtoBtn   = document.getElementById('mailto-btn');
const waBtn       = document.getElementById('wa-btn');

function setFreq(idx) {
  currentFreqIdx = idx;
  const f = freqs[idx];
  if (freqDisplay) freqDisplay.textContent = f.mhz + ' MHz';
  if (motivoInput) motivoInput.value        = f.motivo[currentLang];
  if (mensajeTxt)  mensajeTxt.placeholder   = f.placeholder[currentLang];
  if (dialNeedle)  dialNeedle.style.left     = (idx * 50) + '%';
  if (waBtn)       waBtn.href = `https://wa.me/5491124602224?text=${encodeURIComponent(f.wa[currentLang])}`;
  document.querySelectorAll('.boombox__freq-btn').forEach((b, i) => {
    b.classList.toggle('active', i === idx);
  });
}

document.querySelectorAll('.boombox__freq-btn').forEach((btn, i) => {
  btn.addEventListener('click', () => setFreq(i));
});
setFreq(0);

// Update mailto dynamically
document.getElementById('contact-form').addEventListener('input', () => {
  const nombre  = document.getElementById('c-nombre').value;
  const email   = document.getElementById('c-email').value;
  const motivo  = motivoInput.value;
  const mensaje = mensajeTxt ? mensajeTxt.value : '';
  mailtoBtn.href = `mailto:nancilletta@gmail.com?subject=${encodeURIComponent(motivo + ' — ' + nombre)}&body=${encodeURIComponent(mensaje + '\n\nDesde: ' + email)}`;
});

// ── Timecode counter (HH:MM:SS:FF a 25fps) ──────────────────
const tcDisplay = document.getElementById('hero-timecode');
if (tcDisplay) {
  const startTime = Date.now();
  const FPS = 25;
  const pad = n => String(n).padStart(2, '0');

  setInterval(() => {
    const elapsed      = Date.now() - startTime;
    const totalFrames  = Math.floor(elapsed / (1000 / FPS));
    const ff           = totalFrames % FPS;
    const totalSecs    = Math.floor(elapsed / 1000);
    const ss           = totalSecs % 60;
    const mm           = Math.floor(totalSecs / 60) % 60;
    const hh           = Math.floor(totalSecs / 3600);
    tcDisplay.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
  }, Math.floor(1000 / FPS));
}

// ── Nav hamburger mobile menu ─────────────────────────────
const navEl        = document.querySelector('.nav');
const navHamburger = document.getElementById('nav-hamburger');
const navCollapseEl = document.getElementById('nav-collapse');

if (navHamburger && navCollapseEl) {
  navHamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navEl.classList.toggle('nav--open');
    navHamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navCollapseEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navEl.classList.remove('nav--open');
      navHamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navEl.contains(e.target)) {
      navEl.classList.remove('nav--open');
      navHamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Apply persisted language (AL FINAL — después de todos los const) ──
const savedLang = localStorage.getItem('lang') || 'es';
if (savedLang !== 'es') {
  const savedBtn = document.querySelector(`.nav__lang-opt[data-lang="${savedLang}"]`);
  if (savedBtn) {
    langBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    savedBtn.classList.add('active');
    savedBtn.setAttribute('aria-pressed', 'true');
  }
  applyLang(savedLang);
}
