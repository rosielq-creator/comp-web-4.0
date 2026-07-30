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

const tabs = [...document.querySelectorAll(".artist-name[data-artist]")];
let selectedArtist = -1;
artistData.forEach(({ image }) => {
  const preload = new Image();
  preload.decoding = "async";
  preload.src = image;
  preload.decode?.().catch(() => {});
});
function selectArtist(index) {
  if (index === selectedArtist) return;
  selectedArtist = index;
  const current = artistData[index];
  const preview = document.querySelector(".artist-preview");
  const currentLayer = preview?.querySelector(".artist-preview-layer.is-visible");
  const nextLayer = preview?.querySelector(".artist-preview-layer:not(.is-visible)");
  const nextImage = nextLayer?.querySelector("img");
  if (nextImage && nextLayer && currentLayer) {
    nextImage.src = current.image;
    nextImage.alt = "";
    nextLayer.classList.add("is-visible");
    currentLayer.classList.remove("is-visible");
  }
  document.querySelector("[data-artist-role]").innerHTML = current.role.replaceAll("<br>", " / ");
  const number = String(index + 1).padStart(2, "0");
  const shortNumber = document.querySelector("[data-artist-short-number]");
  if (shortNumber) shortNumber.textContent = number;
  document.querySelector("[data-artist-link]").href = current.href;
  document.querySelector("[data-artist-link]").setAttribute("aria-label", `View ${current.name} profile`);
  tabs.forEach((tab, i) => {
    tab.classList.toggle("is-active", i === index);
    tab.setAttribute("aria-current", i === index ? "true" : "false");
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener("pointerenter", () => selectArtist(index));
  tab.addEventListener("focus", () => selectArtist(index));
  tab.addEventListener("click", (event) => {
    if (matchMedia("(hover: none)").matches && selectedArtist !== index) {
      event.preventDefault();
      selectArtist(index);
    }
  });
});
selectArtist(0);

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

const fluidBlobs = [
  { x: -.10, y: .18, rx: .58, ry: .34, speed: .17, phase: .2, color: [108, 139, 91], alpha: .58 },
  { x: .28, y: .72, rx: .62, ry: .31, speed: -.12, phase: 1.7, color: [73, 104, 65], alpha: .54 },
  { x: .72, y: .28, rx: .56, ry: .38, speed: .14, phase: 3.4, color: [128, 151, 105], alpha: .48 },
  { x: .94, y: .82, rx: .56, ry: .36, speed: -.10, phase: 4.8, color: [54, 85, 53], alpha: .55 },
  { x: .48, y: .48, rx: .36, ry: .58, speed: .08, phase: 2.5, color: [89, 119, 75], alpha: .34 }
];

function drawBlob(blob, t, index) {
  const driftX = Math.sin(t * blob.speed + blob.phase) * width * .16;
  const driftY = Math.cos(t * blob.speed * .73 + blob.phase) * height * .12;
  const x = blob.x * width + driftX;
  const y = blob.y * height + driftY;
  const radius = Math.max(width * blob.rx, height * blob.ry);
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  const [r, g, b] = blob.color;
  gradient.addColorStop(0, `rgba(${r + 24},${g + 22},${b + 18},${blob.alpha})`);
  gradient.addColorStop(.28, `rgba(${r},${g},${b},${blob.alpha * .82})`);
  gradient.addColorStop(.62, `rgba(${Math.max(0, r - 24)},${Math.max(0, g - 24)},${Math.max(0, b - 20)},${blob.alpha * .38})`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  context.save();
  context.translate(x, y);
  context.rotate(Math.sin(t * .07 + index) * .22);
  context.scale(1.35 + Math.sin(t * .11 + index) * .1, .62 + Math.cos(t * .09 + index) * .08);
  context.translate(-x, -y);
  context.fillStyle = gradient;
  context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  context.restore();
}

function draw(time) {
  if (!canvasVisible) {
    frame = 0;
    return;
  }
  context.clearRect(0, 0, width, height);
  const t = time * .001;
  const base = context.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, "#172319");
  base.addColorStop(.34, "#081009");
  base.addColorStop(.68, "#1c2d1c");
  base.addColorStop(1, "#071008");
  context.fillStyle = base;
  context.fillRect(0, 0, width, height);
  context.globalCompositeOperation = "screen";
  fluidBlobs.forEach((blob, index) => drawBlob(blob, t, index));
  const sheen = context.createLinearGradient(0, height * .18, width, height * .82);
  const sweep = .5 + Math.sin(t * .16) * .22;
  sheen.addColorStop(0, "rgba(180,198,157,0)");
  sheen.addColorStop(Math.max(0, sweep - .14), "rgba(180,198,157,0)");
  sheen.addColorStop(sweep, "rgba(180,198,157,.13)");
  sheen.addColorStop(Math.min(1, sweep + .16), "rgba(180,198,157,0)");
  context.fillStyle = sheen;
  context.fillRect(0, 0, width, height);
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
