const artistData = [
  { name: "Maya", role: "Luxury fashion<br>Art direction<br>Digital storytelling", image: "assets/profiles/maya/pink-editorial.png", href: "maya.html" },
  { name: "Amber", role: "Music<br>Fashion<br>Culture", image: "assets/profiles/amber/night-portrait.png", href: "amber.html" },
  { name: "Ooona", role: "Beauty<br>Wellness<br>Spirit", image: "assets/profiles/ooona/hero.png", href: "ooona.html" },
  { name: "Noah", role: "Film<br>Fashion<br>Culture", image: "assets/profiles/noah/black-portrait.png", href: "noah.html" },
  { name: "Mario", role: "Lifestyle<br>Sport<br>Fashion", image: "assets/mario-portrait.png", href: "mario.html" }
];

const header = document.querySelector("[data-header]");
const headerMarker = document.createElement("i");
headerMarker.className = "header-marker";
headerMarker.setAttribute("aria-hidden", "true");
document.body.prepend(headerMarker);
new IntersectionObserver(([entry]) => {
  header?.classList.toggle("is-scrolled", !entry.isIntersecting);
}).observe(headerMarker);

const tabs = [...document.querySelectorAll("[data-artist]")];
let selectedArtist = -1;
function selectArtist(index) {
  if (index === selectedArtist) return;
  selectedArtist = index;
  const current = artistData[index];
  const image = document.querySelector("[data-artist-image]");
  image.style.opacity = "0";
  image.style.transform = index % 2 ? "translateY(3%) scale(.98)" : "translateY(-3%) scale(.98)";
  window.setTimeout(() => {
    image.src = current.image;
    image.alt = current.name;
    image.style.opacity = "1";
    image.style.transform = "";
  }, 180);
  document.querySelector("[data-artist-name]").textContent = current.name;
  document.querySelector("[data-artist-role]").innerHTML = current.role;
  document.querySelector("[data-artist-index]").textContent = String(index + 1).padStart(2, "0");
  document.querySelector("[data-ghost-name]").textContent = current.name.toUpperCase();
  document.querySelector("[data-artist-link]").href = current.href;
  document.querySelector("[data-artist-link]").setAttribute("aria-label", `View ${current.name} profile`);
  document.querySelector("[data-artist-link-text]").href = current.href;
  tabs.forEach((tab, i) => tab.classList.toggle("is-active", i === index));
}
tabs.forEach((tab, index) => tab.addEventListener("click", () => selectArtist(index)));
selectArtist(0);

const stepObserver = new IntersectionObserver(entries => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) selectArtist(Number(visible.target.dataset.step));
}, { threshold: [.2, .45, .7] });
document.querySelectorAll("[data-step]").forEach(step => stepObserver.observe(step));

const videos = [...document.querySelectorAll(".work-media video")];
const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.play().catch(() => {});
  else entry.target.pause();
}), { threshold: .45 });
videos.forEach(video => videoObserver.observe(video));

const canvas = document.querySelector("#mineralCanvas");
const context = canvas?.getContext("2d");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let width = 0;
let height = 0;
let frame = 0;
let canvasVisible = true;

function resizeCanvas() {
  if (!canvas) return;
  const ratio = Math.min(devicePixelRatio, 1.5);
  width = canvas.width = innerWidth * ratio;
  height = canvas.height = innerHeight * ratio;
}

function ribbon(time, index) {
  const t = time * .00025;
  const center = height * (.18 + index * .16);
  const amplitude = height * (.07 + index * .008);
  const thickness = height * (.09 + index * .01);
  const gradient = context.createLinearGradient(0, center, width, center + thickness);
  const alpha = .13 - index * .012;
  gradient.addColorStop(0, `rgba(73,89,66,${alpha * .5})`);
  gradient.addColorStop(.48, `rgba(172,181,158,${alpha})`);
  gradient.addColorStop(1, `rgba(55,71,51,${alpha * .35})`);
  context.beginPath();
  for (let x = -width * .08; x <= width * 1.08; x += width / 32) {
    const y = center + Math.sin(x / width * 5 + t + index * 1.8) * amplitude
      + Math.cos(x / width * 2.4 - t * .6 + index) * amplitude * .45;
    if (x === -width * .08) context.moveTo(x, y - thickness);
    else context.lineTo(x, y - thickness);
  }
  for (let x = width * 1.08; x >= -width * .08; x -= width / 32) {
    const y = center + Math.sin(x / width * 5 + t + index * 1.8) * amplitude
      + Math.cos(x / width * 2.4 - t * .6 + index) * amplitude * .45;
    context.lineTo(x, y + thickness);
  }
  context.closePath();
  context.fillStyle = gradient;
  context.fill();
}

function draw(time) {
  if (!canvasVisible) {
    frame = 0;
    return;
  }
  context.clearRect(0, 0, width, height);
  context.globalCompositeOperation = "screen";
  for (let i = 0; i < 5; i += 1) ribbon(time, i);
  context.globalCompositeOperation = "source-over";
  frame = requestAnimationFrame(draw);
}

if (canvas && context && !reducedMotion.matches) {
  resizeCanvas();
  new ResizeObserver(resizeCanvas).observe(canvas);
  new IntersectionObserver(([entry]) => {
    canvasVisible = entry.isIntersecting;
    if (canvasVisible && !frame) frame = requestAnimationFrame(draw);
  }).observe(canvas);
  frame = requestAnimationFrame(draw);
}
