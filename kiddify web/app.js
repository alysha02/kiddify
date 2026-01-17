function showScene(id){
  document.querySelectorAll(".scene").forEach(s => s.classList.remove("is-active"));
  document.getElementById(id).classList.add("is-active");

  const menuScenes = ["scene-menu", "scene-setting", "scene-play", "scene-progress", "scene-minigame"];
  if (menuScenes.includes(id)) tryPlayBgm();
}

// ===== AUDIO ELEMENTS =====
const bgm = document.getElementById("bgm");
const clickSfx = document.getElementById("clickSfx");

// default ON, tapi ingat pilihan user
let sound = localStorage.getItem("kiddify_sound") !== "off"; // click
let music = localStorage.getItem("kiddify_music") !== "off"; // bgm

// ===== UI ELEMENTS =====
const soundState = document.getElementById("soundState");
const musicState = document.getElementById("musicState");

const btnSoundOn = document.getElementById("soundOn");
const btnSoundOff = document.getElementById("soundOff");
const btnMusicOn = document.getElementById("musicOn");
const btnMusicOff = document.getElementById("musicOff");

function setActive(btnOn, btnOff, isOn){
  if(!btnOn || !btnOff) return;
  btnOn.classList.toggle("active", isOn);
  btnOff.classList.toggle("active", !isOn);
}

function renderStates(){
  if(soundState) soundState.textContent = `Sound: ${sound ? "ON" : "OFF"}`;
  if(musicState) musicState.textContent = `Music: ${music ? "ON" : "OFF"}`;
  setActive(btnSoundOn, btnSoundOff, sound);
  setActive(btnMusicOn, btnMusicOff, music);
}

// ===== CLICK SOUND =====
function playClick(force = false){
  // force=true dipakai untuk bunyi "klik terakhir" saat mematikan sound
  if(!force && !sound) return;
  if(!clickSfx) return;

  clickSfx.currentTime = 0;
  clickSfx.play().catch(()=>{});
}

// ===== BGM =====
function tryPlayBgm(){
  if(!music || !bgm) return;
  bgm.volume = 0.35;
  bgm.play().catch(()=>{});
}

function stopBgm(){
  if(!bgm) return;
  bgm.pause();
  bgm.currentTime = 0;
}

// ===== NAV BUTTONS =====
// IMPORTANT: click sound dicek saat click terjadi,
// jadi kalau sound sudah OFF, tombol lain tidak akan bunyi.
document.querySelectorAll("[data-go]").forEach(btn => {
  btn.addEventListener("click", () => {
    playClick(); // hanya bunyi kalau sound ON
    showScene(btn.dataset.go);
  });
});

// ===== SOUND ON/OFF =====
btnSoundOn?.addEventListener("click", ()=>{
  sound = true;
  localStorage.setItem("kiddify_sound", "on");
  playClick(true); // bunyi untuk feedback
  renderStates();
});

btnSoundOff?.addEventListener("click", ()=>{
  // bunyi sekali terakhir untuk feedback, walaupun setelah ini sound OFF
  playClick(true);
  sound = false;
  localStorage.setItem("kiddify_sound", "off");
  renderStates();
});

// ===== MUSIC ON/OFF =====
btnMusicOn?.addEventListener("click", ()=>{
  music = true;
  localStorage.setItem("kiddify_music", "on");
  playClick(); // bunyi kalau sound ON
  renderStates();
  tryPlayBgm();
});

btnMusicOff?.addEventListener("click", ()=>{
  playClick(); // bunyi kalau sound ON
  music = false;
  localStorage.setItem("kiddify_music", "off");
  renderStates();
  stopBgm();
});

// ===== placeholders =====
document.getElementById("game1")?.addEventListener("click", ()=>{
  playClick();
  alert("Mini-game: Tap the Correct (placeholder)");
});
document.getElementById("game2")?.addEventListener("click", ()=>{
  playClick();
  alert("Mini-game: Match (placeholder)");
});

// Browser butuh interaksi user untuk mulai audio
window.addEventListener("click", () => {
  tryPlayBgm();
}, { once: true });

renderStates();
if(!music) stopBgm();
