/**
 * Movimiento del sitio (sin librerías). Se activa con atributos en el HTML:
 *
 *   data-reveal            sube y aparece al entrar en pantalla ("up" por defecto)
 *   data-reveal="fade"     solo aparece
 *   data-reveal="img"      la imagen se descubre de abajo hacia arriba y se acomoda
 *   data-reveal="wipe"     barrido de izquierda a derecha (dibuja las líneas de arriba)
 *   data-stagger="<tipo>"  aplica data-reveal a cada hijo, en cascada
 *   data-split="chars"     el texto sube letra por letra (títulos grandes)
 *   data-split="words"     el texto sube palabra por palabra (frases)
 *   data-parallax="0.1"    se desplaza más lento/rápido que el scroll
 *   data-draw              círculos de línea fina que se dibujan
 *
 * Todo se apaga con prefers-reduced-motion (el CSS deja los elementos visibles).
 * Si este script no corre, el fallback del <head> quita la clase .js y nada queda oculto.
 */

declare global {
  interface Window {
    __motion?: boolean;
  }
}
window.__motion = true;

const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const root = document.documentElement;

/* ---------- Texto dividido: letras o palabras dentro de una máscara ---------- */
function split(el: HTMLElement) {
  if (el.dataset.splitDone) return;
  el.dataset.splitDone = "";
  const mode = el.dataset.split === "words" ? "words" : "chars";
  const text = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
  // El texto real queda para lectores de pantalla; la versión animada es decorativa.
  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = text;
  const visual = document.createElement("span");
  visual.setAttribute("aria-hidden", "true");
  let i = 0;
  text.split(" ").forEach((word, w) => {
    if (w > 0) visual.append(" ");
    const mask = document.createElement("span");
    mask.className = "split-mask";
    if (mode === "words") {
      const inner = document.createElement("span");
      inner.className = "split-unit";
      inner.style.setProperty("--i", String(i++));
      inner.textContent = word;
      mask.append(inner);
    } else {
      for (const ch of word) {
        const inner = document.createElement("span");
        inner.className = "split-unit";
        inner.style.setProperty("--i", String(i++));
        inner.textContent = ch;
        mask.append(inner);
      }
    }
    visual.append(mask);
  });
  el.replaceChildren(sr, visual);
  el.dataset.reveal ??= "split";
}

/* ---------- Revelado al entrar en pantalla, en cascada por tanda ---------- */
function setupReveal() {
  document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((parent) => {
    const kind = parent.dataset.stagger || "up";
    for (const child of parent.children) {
      const el = child as HTMLElement;
      el.dataset.reveal ??= kind;
    }
  });
  document.querySelectorAll<HTMLElement>("[data-split]").forEach(split);

  const targets = document.querySelectorAll<HTMLElement>("[data-reveal], [data-draw]");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      // Los que entran juntos (una fila de la grilla) salen en cascada, de izquierda a derecha.
      const batch = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
      batch.forEach((e, i) => {
        const el = e.target as HTMLElement;
        if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", `${Math.min(i, 6) * 90}ms`);
        el.classList.add("is-in");
        io.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  targets.forEach((el) => io.observe(el));

  // Cuando el filtro del catálogo muestra cards nuevas, aparecen con un fundido.
  document.addEventListener("catalog:filter", () => {
    document.querySelectorAll<HTMLElement>("[data-catalog-grid] > li:not([hidden])").forEach((li, i) => {
      li.classList.remove("is-in");
      li.style.setProperty("--d", `${Math.min(i, 8) * 50}ms`);
      requestAnimationFrame(() => requestAnimationFrame(() => li.classList.add("is-in")));
    });
  });
}

/* ---------- Parallax: solo calcula los elementos visibles ---------- */
function setupParallax() {
  const els = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
  if (!els.length) return;
  const visible = new Set<HTMLElement>();
  const io = new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement))), {
    rootMargin: "20% 0px",
  });
  els.forEach((el) => io.observe(el));

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    for (const el of visible) {
      const speed = Number(el.dataset.parallax) || 0.1;
      const r = el.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.setProperty("--py", `${offset.toFixed(1)}px`);
    }
  };
  addEventListener("scroll", () => !ticking && (ticking = true) && requestAnimationFrame(update), { passive: true });
  addEventListener("resize", update, { passive: true });
  update();
}

/* ---------- Header: se esconde al bajar, vuelve al subir ---------- */
function setupHeader() {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  if (!header) return;
  let last = scrollY;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY;
    header.toggleAttribute("data-scrolled", y > 8);
    // No lo escondemos mientras hay un diálogo abierto (carrito, lightbox).
    const hide = y > 240 && y > last + 4 && !document.querySelector("dialog[open]");
    if (hide) header.setAttribute("data-hidden", "");
    else if (y < last - 4 || y <= 240) header.removeAttribute("data-hidden");
    last = y;
  };
  addEventListener("scroll", () => !ticking && (ticking = true) && requestAnimationFrame(update), { passive: true });
  header.addEventListener("focusin", () => header.removeAttribute("data-hidden"));
  update();
}

/* ---------- Cinta de texto: acelera un poco con la velocidad del scroll ---------- */
function setupMarquee() {
  const tracks = [...document.querySelectorAll<HTMLElement>("[data-marquee]")];
  if (!tracks.length) return;
  let lastY = scrollY;
  let boost = 0;
  let dir = 1;
  let pos = 0;
  let lastT = performance.now();
  const frame = (t: number) => {
    const dt = Math.min(64, t - lastT);
    lastT = t;
    const dy = scrollY - lastY;
    lastY = scrollY;
    if (dy) dir = dy > 0 ? 1 : -1; // al subir la cinta cambia de sentido
    boost += (Math.min(Math.abs(dy), 80) * 0.06 - boost) * 0.08;
    pos += (0.035 + boost * 0.06) * dt * dir;
    for (const track of tracks) {
      const half = track.scrollWidth / 2;
      if (!half) continue;
      const x = ((pos % half) + half) % half;
      track.style.transform = `translate3d(${-x}px,0,0)`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

/* ---------- Transición entre páginas: la foto de la card viaja a la ficha ---------- */
function setupViewTransitions() {
  const NAME = "product-photo";
  const clear = () => document.querySelectorAll<HTMLElement>("[data-vt-photo]").forEach((el) => (el.style.viewTransitionName = ""));

  document.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='/producto/']");
    const photo = link?.closest(".product-card")?.querySelector<HTMLElement>("[data-vt-photo]");
    if (!photo) return;
    clear();
    photo.style.viewTransitionName = NAME;
  });

  // Al volver de una ficha, la foto vuelve a su card.
  addEventListener("pagereveal", (e: Event) => {
    const vt = (e as Event & { viewTransition?: ViewTransition }).viewTransition;
    const from = (window as unknown as { navigation?: { activation?: { from?: { url?: string } } } }).navigation?.activation?.from?.url;
    if (!vt || !from) return;
    const slug = new URL(from).pathname.match(/^\/producto\/([^/]+)/)?.[1];
    if (!slug || location.pathname.startsWith("/producto/")) return;
    const card = [...document.querySelectorAll<HTMLAnchorElement>(`.product-card a[href^='/producto/${slug}']`)].find((a) => {
      const r = a.closest(".product-card")!.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight;
    });
    const photo = card?.closest(".product-card")?.querySelector<HTMLElement>("[data-vt-photo]");
    if (!photo) return;
    clear();
    photo.style.viewTransitionName = NAME;
    vt.finished.finally(clear);
  });
  addEventListener("pageshow", (e) => (e as PageTransitionEvent).persisted && clear());
}

function init() {
  setupHeader();
  setupViewTransitions();
  if (reduced.matches) {
    document.querySelectorAll<HTMLElement>("[data-reveal], [data-draw], [data-stagger] > *").forEach((el) => el.classList.add("is-in"));
    return;
  }
  setupReveal();
  setupParallax();
  setupMarquee();
}

init();
root.classList.add("motion-ready");

export {};
