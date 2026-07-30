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

function ribbon(time, index) {
  const t = time * .00062;
  const center = height * (.18 + index * .13);
  const amplitude = height * (.095 + index * .01);
  const thickness = height * (.12 + index * .012);
  const gradient = context.createLinearGradient(0, center - thickness, width, center + thickness);
  const alpha = .18 - index * .015;
  gradient.addColorStop(0, `rgba(91,108,82,${alpha * .45})`);
  gradient.addColorStop(.48, `rgba(182,190,170,${alpha})`);
  gradient.addColorStop(1, `rgba(63,80,58,${alpha * .35})`);
  context.beginPath();
  for (let x = -width * .08; x <= width * 1.08; x += width / 28) {
    const y = center
      + Math.sin(x / width * 5.4 + t * (.78 + index * .08) + index * 1.7) * amplitude
      + Math.cos(x / width * 2.1 - t * .46 + index) * amplitude * .42;
    if (x === -width * .08) context.moveTo(x, y - thickness);
    else context.lineTo(x, y - thickness);
  }
  for (let x = width * 1.08; x >= -width * .08; x -= width / 28) {
    const y = center
      + Math.sin(x / width * 5.4 + t * (.78 + index * .08) + index * 1.7) * amplitude
      + Math.cos(x / width * 2.1 - t * .46 + index) * amplitude * .42;
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
  for (let index = 0; index < 6; index += 1) ribbon(time, index);
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
