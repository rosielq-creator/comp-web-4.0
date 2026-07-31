const artistData = [
  { name: "Maya", role: "Luxury fashion<br>Art direction<br>Digital storytelling", copy: "A precise visual voice shaped for fashion, image-making and contemporary culture.", image: "assets/artist-previews/maya.webp", href: "maya.html" },
  { name: "Amber", role: "Music<br>Fashion<br>Culture", copy: "A vivid creative presence moving between sound, style and youth culture.", image: "assets/artist-previews/amber.webp", href: "amber.html" },
  { name: "Ooona", role: "Beauty<br>Wellness<br>Spirit", copy: "A softer perspective exploring beauty, wellbeing and inner life.", image: "assets/artist-previews/ooona.webp", href: "ooona.html" },
  { name: "Noah", role: "Film<br>Fashion<br>Culture", copy: "A cinematic character built for modern stories, fashion and visual culture.", image: "assets/artist-previews/noah.webp", href: "noah.html" },
  { name: "Mario", role: "Lifestyle<br>Sport<br>Fashion", copy: "An energetic personality connecting movement, everyday life and style.", image: "assets/artist-previews/mario.webp", href: "mario.html" }
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
const artistsSection = document.querySelector("#artists");
let selectedArtist = -1;
let artistRotationTimer = 0;
let artistRotationPaused = false;
const artistReduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
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
  document.querySelector("[data-artist-role]").innerHTML = current.role;
  document.querySelector("[data-artist-name]").textContent = current.name;
  const displayName = document.querySelector("[data-artist-display]");
  if (displayName) {
    displayName.classList.remove("is-changing");
    void displayName.offsetWidth;
    displayName.textContent = current.name;
    displayName.classList.add("is-changing");
  }
  document.querySelector("[data-artist-copy]").textContent = current.copy;
  const number = String(index + 1).padStart(2, "0");
  const shortNumber = document.querySelector("[data-artist-short-number]");
  if (shortNumber) shortNumber.textContent = number;
  document.querySelector("[data-artist-link]").href = current.href;
  document.querySelector("[data-artist-link]").setAttribute("aria-label", `View ${current.name} profile`);
  document.querySelector("[data-artist-detail-link]").href = current.href;
  tabs.forEach((tab, i) => {
    tab.classList.toggle("is-active", i === index);
    tab.setAttribute("aria-current", i === index ? "true" : "false");
  });
}

function stopArtistRotation() {
  window.clearInterval(artistRotationTimer);
  artistRotationTimer = 0;
}

function startArtistRotation() {
  stopArtistRotation();
  if (!artistsSection?.classList.contains("is-in-view") || artistRotationPaused || artistReduceMotion.matches) return;
  artistRotationTimer = window.setInterval(() => {
    selectArtist((selectedArtist + 1) % artistData.length);
  }, 3200);
}

tabs.forEach((tab, index) => {
  tab.addEventListener("pointerenter", () => {
    artistRotationPaused = true;
    stopArtistRotation();
    selectArtist(index);
  });
  tab.addEventListener("focus", () => selectArtist(index));
  tab.addEventListener("click", (event) => {
    if (matchMedia("(hover: none)").matches && selectedArtist !== index) {
      event.preventDefault();
      selectArtist(index);
    }
  });
});
selectArtist(0);

if (artistsSection) {
  const artistSectionObserver = new IntersectionObserver(([entry]) => {
    artistsSection.classList.toggle("is-in-view", entry.isIntersecting);
    if (entry.isIntersecting) startArtistRotation();
    else stopArtistRotation();
  }, { threshold: .35 });
  artistSectionObserver.observe(artistsSection);

  artistsSection.addEventListener("pointerleave", () => {
    artistRotationPaused = false;
    startArtistRotation();
  });
  artistsSection.addEventListener("focusout", (event) => {
    if (!artistsSection.contains(event.relatedTarget)) {
      artistRotationPaused = false;
      startArtistRotation();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopArtistRotation();
    else startArtistRotation();
  });
  artistReduceMotion.addEventListener?.("change", startArtistRotation);
}

const videos = [...document.querySelectorAll(".work-media video")];
function formatVideoTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

videos.forEach((video) => {
  const media = video.closest(".work-media");
  if (!media) return;

  const caseLink = document.createElement("a");
  caseLink.className = "work-media-link";
  caseLink.href = media.dataset.caseHref;
  caseLink.setAttribute("aria-label", media.dataset.caseLabel);

  const controls = document.createElement("div");
  controls.className = "work-video-controls";
  controls.innerHTML = `
    <button class="work-play" type="button" aria-label="Pause video">Pause</button>
    <input class="work-progress" type="range" min="0" max="1000" value="0" step="1" aria-label="Video progress">
    <output class="work-time">0:00 / 0:00</output>
    <button class="work-sound" type="button" aria-label="Turn sound on" aria-pressed="false">Sound</button>
    <button class="work-fullscreen" type="button" aria-label="Enter fullscreen">Full</button>
  `;
  media.append(caseLink, controls);

  const playButton = controls.querySelector(".work-play");
  const progress = controls.querySelector(".work-progress");
  const time = controls.querySelector(".work-time");
  const soundButton = controls.querySelector(".work-sound");
  const fullscreenButton = controls.querySelector(".work-fullscreen");

  const syncControls = () => {
    playButton.textContent = video.paused ? "Play" : "Pause";
    playButton.setAttribute("aria-label", `${video.paused ? "Play" : "Pause"} video`);
    soundButton.textContent = video.muted ? "Sound" : "Mute";
    soundButton.setAttribute("aria-label", video.muted ? "Turn sound on" : "Mute video");
    soundButton.setAttribute("aria-pressed", String(!video.muted));
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const progressValue = duration ? video.currentTime / duration : 0;
    progress.value = String(Math.round(progressValue * 1000));
    progress.style.setProperty("--video-progress", `${progressValue * 100}%`);
    time.value = `${formatVideoTime(video.currentTime)} / ${formatVideoTime(duration)}`;
  };

  playButton.addEventListener("click", () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
  progress.addEventListener("input", () => {
    if (!Number.isFinite(video.duration)) return;
    video.currentTime = Number(progress.value) / 1000 * video.duration;
  });
  soundButton.addEventListener("click", () => {
    videos.forEach((other) => {
      if (other !== video) other.muted = true;
    });
    video.muted = !video.muted;
    if (video.paused) video.play().catch(() => {});
    videos.forEach((item) => item.dispatchEvent(new Event("volumechange")));
  });
  fullscreenButton.addEventListener("click", async () => {
    try {
      if (media.requestFullscreen) await media.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    } catch {
      // Fullscreen support is controlled by the browser and device.
    }
  });
  video.addEventListener("click", () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
  ["play", "pause", "timeupdate", "loadedmetadata", "volumechange"].forEach((eventName) => {
    video.addEventListener(eventName, syncControls);
  });
  syncControls();
});

const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.play().catch(() => {});
  else entry.target.pause();
}), { threshold: .45 });
videos.forEach(video => videoObserver.observe(video));

const workRows = [...document.querySelectorAll(".work-row")];
if (workRows.length) {
  const workRevealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-inview");
      workRevealObserver.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });
  workRows.forEach(row => workRevealObserver.observe(row));
}

const serviceData = [
  {
    image: "assets/artist-previews/maya.webp",
    caption: "Find the right digital face for the idea."
  },
  {
    image: "assets/artist-previews/amber.webp",
    caption: "Build the identity, voice and world around the talent."
  },
  {
    image: "assets/work/takoyaki-poster.jpg",
    caption: "Turn the creative system into moving image and content."
  },
  {
    image: "assets/work/peninsula/peninsula-fathers-day-key-visual.jpg",
    caption: "Connect talent, story and distribution in one campaign."
  }
];
const serviceItems = [...document.querySelectorAll("[data-service]")];
let activeService = -1;
function selectService(index) {
  if (index === activeService || !serviceData[index]) return;
  activeService = index;
  const visual = document.querySelector(".service-visual");
  const currentLayer = visual?.querySelector(".service-visual-layer.is-visible");
  const nextLayer = visual?.querySelector(".service-visual-layer:not(.is-visible)");
  const nextImage = nextLayer?.querySelector("img");
  if (currentLayer && nextLayer && nextImage) {
    nextImage.src = serviceData[index].image;
    nextLayer.classList.add("is-visible");
    currentLayer.classList.remove("is-visible");
  }
  const serviceIndex = document.querySelector("[data-service-index]");
  const serviceCaption = document.querySelector("[data-service-caption]");
  if (serviceIndex) serviceIndex.textContent = String(index + 1).padStart(2, "0");
  if (serviceCaption) serviceCaption.textContent = serviceData[index].caption;
  serviceItems.forEach((item, itemIndex) => {
    item.classList.toggle("is-active", itemIndex === index);
    item.setAttribute("aria-pressed", String(itemIndex === index));
  });
}
serviceItems.forEach((item, index) => {
  item.addEventListener("pointerenter", () => selectService(index));
  item.addEventListener("focus", () => selectService(index));
  item.addEventListener("click", () => selectService(index));
});
selectService(0);

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
