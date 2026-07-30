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

function ribbon(time, index) {
  const t = time * .00016;
  const center = height * (.04 + index * .15);
  const amplitude = height * (.105 + index * .006);
  const thickness = height * (.105 + index * .012);
  const gradient = context.createLinearGradient(0, center, width, center + thickness);
  const alpha = .16 - index * .012;
  gradient.addColorStop(0, `rgba(74,82,74,${alpha * .55})`);
  gradient.addColorStop(.42, `rgba(164,166,153,${alpha})`);
  gradient.addColorStop(.68, `rgba(112,119,108,${alpha * .82})`);
  gradient.addColorStop(1, `rgba(43,51,45,${alpha * .42})`);
  context.beginPath();
  for (let x = -width * .08; x <= width * 1.08; x += width / 32) {
    const y = center + Math.sin(x / width * 4.1 + t + index * 1.54) * amplitude
      + Math.cos(x / width * 2.15 - t * .72 + index) * amplitude * .56;
    if (x === -width * .08) context.moveTo(x, y - thickness);
    else context.lineTo(x, y - thickness);
  }
  for (let x = width * 1.08; x >= -width * .08; x -= width / 32) {
    const y = center + Math.sin(x / width * 4.1 + t + index * 1.54) * amplitude
      + Math.cos(x / width * 2.15 - t * .72 + index) * amplitude * .56;
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
  const base = context.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, "#313730");
  base.addColorStop(.38, "#171c18");
  base.addColorStop(.7, "#232923");
  base.addColorStop(1, "#101411");
  context.fillStyle = base;
  context.fillRect(0, 0, width, height);
  context.globalCompositeOperation = "screen";
  for (let i = 0; i < 7; i += 1) ribbon(time, i);
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
