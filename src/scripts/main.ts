import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Mode = 'f' | 'd';
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const mode = (): Mode => (root.getAttribute('data-mode') === 'd' ? 'd' : 'f');
const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* stockage indisponible */ } },
  sget(k: string) { try { return sessionStorage.getItem(k); } catch { return null; } },
  sset(k: string, v: string) { try { sessionStorage.setItem(k, v); } catch { /* stockage indisponible */ } },
};

/* ------------------------------------------------------------------
   1. Bouton de mode : immersif (F) ⇄ simple (D)
   ------------------------------------------------------------------ */
const modeBtn = document.querySelector<HTMLButtonElement>('[data-mode-toggle]');
function applyMode(m: Mode, persist: boolean) {
  root.setAttribute('data-mode', m);
  modeBtn?.setAttribute('aria-pressed', String(m === 'd'));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', m === 'd' ? '#F3F1EC' : '#0B0B0B');
  if (persist) store.set('pf-mode', m);
  setNameWeights();
  layoutGallery();
  lens?.classList.remove('is-on');
  requestAnimationFrame(() => ScrollTrigger.refresh());
}
modeBtn?.setAttribute('aria-pressed', String(mode() === 'd'));
modeBtn?.addEventListener('click', () => {
  const next: Mode = mode() === 'f' ? 'd' : 'f';
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition && !reduceMotion) doc.startViewTransition(() => applyMode(next, true));
  else applyMode(next, true);
});

/* ------------------------------------------------------------------
   2. Menu mobile
   ------------------------------------------------------------------ */
const menu = document.getElementById('menu-mobile');
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');
function setMenu(open: boolean) {
  if (!menu) return;
  menu.setAttribute('data-open', String(open));
  menu.toggleAttribute('inert', !open);
  openBtn?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  (open ? closeBtn : openBtn)?.focus();
}
openBtn?.addEventListener('click', () => setMenu(true));
closeBtn?.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu?.getAttribute('data-open') === 'true') setMenu(false); });

/* ------------------------------------------------------------------
   3. Nom à graisse variable + lentille (mode immersif, ordinateur)
   ------------------------------------------------------------------ */
const nameEl = document.querySelector<HTMLElement>('[data-name]');
const lens = document.querySelector<HTMLElement>('.lens');
const chars: HTMLElement[] = [];
if (nameEl) {
  nameEl.querySelectorAll<HTMLElement>('.word').forEach((w) => {
    const t = w.textContent ?? '';
    w.textContent = '';
    [...t].forEach((c) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      w.appendChild(s);
      chars.push(s);
    });
  });
}
function setNameWeights() {
  const base = [800, 700, 560, 460, 420, 460, 520, 640, 760, 800, 700, 560, 460];
  chars.forEach((c, i) => c.style.setProperty('--w', String(base[i % base.length])));
}
setNameWeights();

if (finePointer && !reduceMotion) {
  let raf = 0;
  let mx = 0;
  let my = 0;
  window.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (mode() !== 'f') return;
      if (lens) { lens.style.left = `${mx}px`; lens.style.top = `${my}px`; }
      if (!chars.length) return;
      const box = nameEl!.getBoundingClientRect();
      const near = my > box.top - 160 && my < box.bottom + 160;
      lens?.classList.toggle('is-on', near);
      if (!near) return;
      chars.forEach((c) => {
        const r = c.getBoundingClientRect();
        const d = Math.hypot(mx - (r.left + r.width / 2), (my - (r.top + r.height / 2)) * 1.4);
        c.style.setProperty('--w', String(Math.round(800 - Math.min(d / (r.height * 2.2), 1) * 400)));
      });
    });
  }, { passive: true });
  document.addEventListener('pointerleave', () => { lens?.classList.remove('is-on'); setNameWeights(); });
}

/* ------------------------------------------------------------------
   4. Animations GSAP (le contenu reste visible sans JavaScript)
   ------------------------------------------------------------------ */
if (!reduceMotion) {
  // Intro du nom : une fois par session, en mode immersif.
  if (chars.length && mode() === 'f' && !store.sget('pf-intro')) {
    store.sset('pf-intro', '1');
    gsap.from(chars, { yPercent: 60, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.045 });
  }
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  items.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92) return; // déjà visible au chargement : on n'y touche pas
    gsap.set(el, { opacity: 0, y: mode() === 'f' ? 40 : 0 });
  });
  ScrollTrigger.batch(items, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: mode() === 'f' ? 0.9 : 0.5, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });
}

/* ------------------------------------------------------------------
   5. Page Work : filtres, galerie à glisser, progression
   ------------------------------------------------------------------ */
const gallery = document.querySelector<HTMLElement>('[data-gallery]');
const filterBox = document.querySelector<HTMLElement>('[data-filters]');
const cards = gallery ? [...gallery.querySelectorAll<HTMLElement>('.card')] : [];

function layoutGallery() {
  if (!gallery) return;
  const visible = cards.filter((c) => !c.hidden);
  visible.forEach((c, i) => c.classList.toggle('is-offset', i % 3 === 1));
  gallery.scrollLeft = 0;
  updateProgress();
}
function updateProgress() {
  if (!gallery) return;
  const bar = document.querySelector<HTMLElement>('[data-bar]');
  const pos = document.querySelector<HTMLElement>('[data-pos]');
  const tot = document.querySelector<HTMLElement>('[data-total]');
  const n = cards.filter((c) => !c.hidden).length;
  const max = gallery.scrollWidth - gallery.clientWidth;
  const p = max > 0 ? gallery.scrollLeft / max : 1;
  const w = Math.min(100, Math.max(10, (gallery.clientWidth / Math.max(1, gallery.scrollWidth)) * 100));
  if (bar) { bar.style.width = `${w}%`; bar.style.left = `${p * (100 - w)}%`; }
  if (pos) pos.textContent = String(Math.min(n, Math.max(1, Math.round(p * (n - 1)) + 1))).padStart(2, '0');
  if (tot) tot.textContent = String(n).padStart(2, '0');
}
function applyFilter(f: string, push: boolean) {
  if (!filterBox || !gallery) return;
  const btn = filterBox.querySelector<HTMLButtonElement>(`[data-filter="${f}"]`);
  if (!btn || btn.disabled) f = 'all';
  filterBox.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
  let n = 0;
  cards.forEach((c) => { const show = f === 'all' || c.dataset.cat === f; c.hidden = !show; if (show) n++; });
  const count = document.querySelector('[data-count]');
  if (count) count.textContent = String(n);
  const status = document.querySelector('[data-filter-status]');
  if (status) status.textContent = `${n} projet${n > 1 ? 's' : ''} affiché${n > 1 ? 's' : ''}`;
  layoutGallery();
  if (!reduceMotion) gsap.fromTo(cards.filter((c) => !c.hidden), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.05, overwrite: true });
  const url = new URL(location.href);
  if (f === 'all') url.searchParams.delete('f'); else url.searchParams.set('f', f);
  if (push) history.replaceState(null, '', url);
  store.sset('pf-work-url', url.pathname + url.search);
  ScrollTrigger.refresh();
}
if (filterBox && gallery) {
  filterBox.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-filter]');
    if (b) applyFilter(b.dataset.filter ?? 'all', true);
  });
  applyFilter(new URLSearchParams(location.search).get('f') ?? 'all', false);

  gallery.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  // Glisser à la souris (mode immersif)
  let down = false; let moved = 0; let sx = 0; let sl = 0;
  gallery.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || mode() !== 'f' || gallery.scrollWidth <= gallery.clientWidth) return;
    down = true; moved = 0; sx = e.clientX; sl = gallery.scrollLeft;
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    moved = Math.abs(e.clientX - sx);
    if (moved > 4) gallery.classList.add('is-dragging');
    gallery.scrollLeft = sl - (e.clientX - sx);
  });
  window.addEventListener('pointerup', () => { down = false; setTimeout(() => gallery.classList.remove('is-dragging'), 0); });
  gallery.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
  // Molette verticale → défilement horizontal en mode immersif
  gallery.addEventListener('wheel', (e) => {
    if (mode() !== 'f' || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = gallery.scrollWidth - gallery.clientWidth;
    if (max <= 0) return;
    const atStart = gallery.scrollLeft <= 0 && e.deltaY < 0;
    const atEnd = gallery.scrollLeft >= max - 1 && e.deltaY > 0;
    if (atStart || atEnd) return;
    e.preventDefault();
    gallery.scrollLeft += e.deltaY;
  }, { passive: false });
}

// Le lien « Retour à Work » garde le dernier filtre utilisé
const back = document.querySelector<HTMLAnchorElement>('[data-back]');
const lastWork = store.sget('pf-work-url');
if (back && lastWork) back.href = lastWork;

/* ------------------------------------------------------------------
   6. Aperçu vidéo au survol des cartes (ordinateur)
   ------------------------------------------------------------------ */
if (finePointer && !reduceMotion) {
  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    const v = card.querySelector<HTMLVideoElement>('video[data-src]');
    if (!v) return;
    let t = 0;
    card.addEventListener('mouseenter', () => {
      t = window.setTimeout(() => {
        if (!v.src) v.src = v.dataset.src!;
        v.play().then(() => card.classList.add('is-playing')).catch(() => {});
      }, 250);
    });
    card.addEventListener('mouseleave', () => { clearTimeout(t); v.pause(); card.classList.remove('is-playing'); });
  });
}

/* ------------------------------------------------------------------
   7. Contact : copier l'e-mail et envoyer le formulaire
   ------------------------------------------------------------------ */
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((b) => {
  b.addEventListener('click', async () => {
    const label = b.querySelector('span');
    try {
      await navigator.clipboard.writeText(b.dataset.copy ?? '');
      if (label) label.textContent = 'Copié';
    } catch {
      const a = document.querySelector('[data-email]');
      if (a) { const r = document.createRange(); r.selectNodeContents(a); const s = getSelection(); s?.removeAllRanges(); s?.addRange(r); }
      if (label) label.textContent = 'Sélectionné';
    }
    setTimeout(() => { if (label) label.textContent = 'Copier'; }, 1800);
  });
});

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
if (form) {
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const rules: [string, (v: string) => boolean, string][] = [
    ['name', (v) => v.trim().length >= 2, 'Indiquez votre nom.'],
    ['email', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), 'Indiquez une adresse e-mail valide, par exemple nom@entreprise.fr.'],
    ['message', (v) => v.trim().length >= 10, 'Écrivez au moins quelques mots (10 caractères minimum).'],
  ];
  const validate = () => {
    let first: HTMLElement | null = null;
    rules.forEach(([name, test, msg]) => {
      const input = form.elements.namedItem(name) as HTMLInputElement;
      const field = input.closest<HTMLElement>('.field')!;
      const err = field.querySelector<HTMLElement>('.err')!;
      const ok = test(input.value);
      field.dataset.invalid = String(!ok);
      input.setAttribute('aria-invalid', String(!ok));
      input.setAttribute('aria-describedby', err.id);
      err.textContent = ok ? '' : msg;
      if (!ok && !first) first = input;
    });
    (first as HTMLElement | null)?.focus();
    return !first;
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const btn = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
    btn.disabled = true;
    btn.textContent = 'Envoi…';
    status.hidden = true;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || 'L’envoi a échoué.');
      form.reset();
      status.dataset.state = 'ok';
      status.textContent = 'Merci, votre message est bien parti. Je vous réponds rapidement.';
    } catch (err) {
      status.dataset.state = 'error';
      const email = document.querySelector('[data-email]')?.textContent ?? '';
      status.textContent = `${(err as Error).message} Vous pouvez m’écrire directement à ${email}.`;
    } finally {
      status.hidden = false;
      btn.disabled = false;
      btn.textContent = 'Envoyer le message';
    }
  });
}
