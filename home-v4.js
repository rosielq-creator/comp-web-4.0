const artistData = [
  {name:"Maya",role:"Luxury fashion · Art",image:"assets/profiles/maya/pink-editorial.png",href:"maya.html"},
  {name:"Amber",role:"Music · Fashion · Culture",image:"assets/profiles/amber/night-portrait.png",href:"amber.html"},
  {name:"Ooona",role:"Beauty · Wellness · Spirit",image:"assets/profiles/ooona/hero.png",href:"ooona.html"},
  {name:"Noah",role:"Film · Fashion · Culture",image:"assets/profiles/noah/black-portrait.png",href:"noah.html"},
  {name:"Mario",role:"Lifestyle · Sport · Fashion",image:"assets/mario-portrait.png",href:"mario.html"}
];

const header = document.querySelector("[data-header]");
const syncHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
addEventListener("scroll", syncHeader, {passive: true});
syncHeader();

const tabs=[...document.querySelectorAll("[data-artist]")];
function selectArtist(index){
  const current=artistData[index],previous=artistData[(index+artistData.length-1)%artistData.length],next=artistData[(index+1)%artistData.length];
  const image=document.querySelector("[data-artist-image]");
  image.style.opacity="0";
  setTimeout(()=>{image.src=current.image;image.alt=current.name;image.style.opacity="1"},160);
  document.querySelector("[data-artist-name]").textContent=current.name;
  document.querySelector("[data-artist-role]").textContent=current.role;
  document.querySelector("[data-artist-index]").textContent=String(index+1).padStart(2,"0");
  document.querySelector("[data-ghost-prev]").textContent=previous.name.toUpperCase();
  document.querySelector("[data-ghost-name]").textContent=current.name.toUpperCase();
  document.querySelector("[data-ghost-next]").textContent=next.name.toUpperCase();
  document.querySelector("[data-artist-link]").href=current.href;
  document.querySelector("[data-artist-link-text]").href=current.href;
  tabs.forEach((tab,i)=>tab.classList.toggle("is-active",i===index));
}
tabs.forEach((tab,index)=>tab.addEventListener("click",()=>selectArtist(index)));

const videos=[...document.querySelectorAll(".work-media video")];
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting) entry.target.play().catch(()=>{});
  else entry.target.pause();
}),{threshold:.45});
videos.forEach(video=>observer.observe(video));

const canvas=document.querySelector("#mineralCanvas");
const ctx=canvas?.getContext("2d");
let width=0,height=0,raf=0;
function resize(){width=canvas.width=innerWidth*devicePixelRatio;height=canvas.height=innerHeight*devicePixelRatio}
function draw(time){
  ctx.clearRect(0,0,width,height);
  const t=time*.00012;
  ctx.globalCompositeOperation="screen";
  for(let i=0;i<7;i++){
    const phase=t+i*1.37;
    const x=width*(.5+Math.sin(phase*.83+i)*(.22+i*.008));
    const y=height*(.46+Math.cos(phase*.61+i*.72)*(.18+i*.006));
    const r=Math.max(width,height)*(.2+i*.018);
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,`rgba(${78+i*7},${94+i*8},${72+i*6},${.15-i*.011})`);
    g.addColorStop(.46,`rgba(${56+i*5},${70+i*6},${52+i*4},${.08-i*.006})`);
    g.addColorStop(1,"rgba(11,13,10,0)");
    ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
  }
  ctx.globalCompositeOperation="source-over";
  raf=requestAnimationFrame(draw);
}
if(canvas&&ctx&&!matchMedia("(prefers-reduced-motion: reduce)").matches){resize();addEventListener("resize",resize);raf=requestAnimationFrame(draw)}
