/* =========================================================
   ✏️  EDITA AQUÍ LOS NOMBRES Y EL MENSAJE
   ========================================================= */
const CONFIG = {
  profesor: "Profe Fredy",
  de: "Solanyi Cerón",
  mensaje:
    "Gracias por cada uno de esos actos que me llenan de alegría. " +
    "Hay pruebas que no salen en ningún examen. En los momentos más duros, usted estuvo ahí: " +
    "escuchándome, apoyándome y creyendo en mí cuando más lo necesitaba. Como en el motocross, " +
    "la pista tuvo saltos, barro y curvas cerradas, pero gracias a usted aprendí a no soltar el " +
    "acelerador. Gracias por ser mucho más que un profesor. 🧡",
};

/* ---------- Rellenar textos ---------- */
document.querySelectorAll(".nombre-profe").forEach(el => el.textContent = CONFIG.profesor.toUpperCase());
document.querySelectorAll(".nombre-de").forEach(el => el.textContent = CONFIG.de);
document.getElementById("mensaje").textContent = CONFIG.mensaje;

/* ---------- Código que se escribe solo ---------- */
const codigo = `// Compilando gratitud...
const profe = {
  nombre: "${CONFIG.profesor}",
  carisma: Infinity,
  formaDeEnseñar: "la mejor",
  apoyo: "en los momentos más duros",
  enseñanza: "más allá del aula",
  velocidad: 100,
};

function agradecer(profe) {
  let corazon = "lleno";
  while (vida.continua()) {
    recordar(profe.apoyo);
  }
  return "¡GRACIAS DE CORAZÓN! 🏁";
}

console.log(agradecer(profe));
// > ¡GRACIAS DE CORAZÓN! 🏁`;

const escapeHTML = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function resaltar(texto) {
  const regex = /(\/\/[^\n]*)|("[^"\n]*"?)|\b(const|let|function|while|return)\b|\b(\d+|Infinity)\b|\b([a-zA-Z_]\w*)(?=\()/g;
  let html = "", last = 0, m;
  while ((m = regex.exec(texto))) {
    html += escapeHTML(texto.slice(last, m.index));
    const [tok] = m;
    const cls = m[1] ? "com" : m[2] ? "str" : m[3] ? "kw" : m[4] ? "num" : "fn";
    html += `<span class="${cls}">${escapeHTML(tok)}</span>`;
    last = m.index + tok.length;
  }
  return html + escapeHTML(texto.slice(last));
}

const pre = document.getElementById("codigo");
let escrito = false;
function escribirCodigo() {
  if (escrito) return;
  escrito = true;
  let i = 0;
  const tick = () => {
    i += 2;
    pre.innerHTML = resaltar(codigo.slice(0, i));
    if (i < codigo.length) setTimeout(tick, 28);
  };
  tick();
}

/* ---------- Aparición al hacer scroll ---------- */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    if (e.target.classList.contains("terminal")) escribirCodigo();
    if (e.target.classList.contains("finish")) setTimeout(confeti, 500);
    obs.unobserve(e.target);
  });
}, { threshold: 0.25 });
document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

/* ---------- Canvas: polvo y confeti ---------- */
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
let particulas = [];

function ajustar() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", ajustar);
ajustar();

function polvo(x, y) {
  for (let k = 0; k < 3; k++) {
    particulas.push({
      x, y,
      vx: -Math.random() * 3 - 1,
      vy: -Math.random() * 2,
      r: Math.random() * 6 + 3,
      vida: 1,
      color: `rgba(${150 + Math.random() * 40},${100 + Math.random() * 30},60,`,
      tipo: "polvo",
    });
  }
}

function confeti() {
  const colores = ["#ff6b1a", "#ffb21a", "#ffffff", "#111111", "#39ff88"];
  for (let k = 0; k < 160; k++) {
    particulas.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 2,
      r: Math.random() * 7 + 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      vida: 1,
      color: colores[Math.floor(Math.random() * colores.length)],
      tipo: "confeti",
    });
  }
}

function loopFX() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particulas = particulas.filter(p => p.vida > 0 && p.y < canvas.height + 40);
  for (const p of particulas) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.tipo === "polvo") {
      p.vida -= 0.02;
      p.r += 0.3;
      ctx.fillStyle = p.color + (p.vida * 0.5) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      p.rot += p.vr;
      p.vy += 0.03;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    }
  }
  requestAnimationFrame(loopFX);
}
loopFX();

/* ---------- La moto: carrera con salto ---------- */
const moto = document.getElementById("moto");
const track = document.querySelector(".track");
let corriendo = false;

function carrera() {
  if (corriendo) return;
  corriendo = true;
  moto.classList.add("running");

  const ancho = track.clientWidth;
  const motoW = moto.offsetWidth;
  const inicio = -motoW - 20;
  const fin = ancho + 20;
  moto.style.left = inicio + "px";
  const duracion = 3600;
  const saltoIni = 0.42, saltoFin = 0.66;     // tramo del salto (proporción de la pista)
  const altura = Math.min(140, track.clientHeight * 0.4);
  const t0 = performance.now();

  function frame(now) {
    const t = Math.min((now - t0) / duracion, 1);
    const x = inicio + (fin - inicio) * t;
    const pos = (x + motoW * 0.5) / ancho;     // posición del centro de la moto
    let y = 0, rot = 0;

    if (pos > saltoIni && pos < saltoFin) {
      const s = (pos - saltoIni) / (saltoFin - saltoIni);
      y = -altura * 4 * s * (1 - s);
      rot = -18 + 30 * s;                      // sube con la rueda delantera arriba y aterriza
    } else {
      const rect = moto.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) {
        polvo(rect.left + rect.width * 0.2, rect.bottom - 6);
      }
    }

    moto.style.transform = `translate(${x - inicio}px, ${y}px) rotate(${rot}deg)`;

    if (t < 1) requestAnimationFrame(frame);
    else {
      moto.classList.remove("running");
      moto.style.transform = "";
      corriendo = false;
    }
  }
  requestAnimationFrame(frame);
}

document.getElementById("btnArrancar").addEventListener("click", carrera);
document.getElementById("btnCelebrar").addEventListener("click", () => { confeti(); carrera(); });

// Primera vuelta automática al abrir la página
setTimeout(carrera, 900);
