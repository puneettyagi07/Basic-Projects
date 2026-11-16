const songCards = document.querySelector(".songCards");
const artistDetails = document.querySelector(".artistDetails");

const createBtn = document.querySelector(".createBtn");
const createSvg = document.querySelector(".createBtn svg");
const createLibraryPopUp = document.getElementById("createLibraryPopUp");

const search = document.getElementById("songSearch");

// Modal & Player Elements
const popUpOverlay = document.getElementById("popUpOverlay");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalArtist = document.getElementById("modalArtist");

// Audio Controls & Progress Elements
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const totalDurationEl = document.getElementById("totalDuration");

const shuffleBtn = document.getElementById("shuffleBtn");
const prevBtn = document.getElementById("prevBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const nextBtn = document.getElementById("nextBtn");
const repeatBtn = document.getElementById("repeatBtn");

const api = [
  {
    id: 0,
    songTitle: "Alfaaz",
    SongCover: "imges/songs/Alfaaz Hamza Malik x Zain Zohaib.png",
    song: "songs/Alfaaz Hamza Malik x Zain Zohaib Official Visualiser.mp3",
    artist: "Alfaaz Hamza",
    artistImg: "imges/artists/hamza malik.jpeg",
  },
  {
    id: 1,
    songTitle: "Banger",
    SongCover: "imges/songs/Banger.png",
    song: "songs/BANGER (Official Music Video) Badshah x Sharvi x Hiten ft Aveera Singh _ #desihiphop [sY45iA7PFS8].mp3",
    artist: "Badshah",
    artistImg: "imges/artists/badshah.jpeg",
  },
  {
    id: 2,
    songTitle: "Bari",
    SongCover: "imges/songs/bari Nijjar and jazz.png",
    song: "songs/NIJJAR & Jazz Dee - Bari.mp4",
    artist: "Nijjar",
    artistImg: "imges/songs/bari Nijjar and jazz.png",
  },
  {
    id: 3,
    songTitle: "Sammi Meri",
    SongCover: "imges/songs/coke studio season 8 sammi meri.png",
    song: "songs/Rathinamo (feat. Tanisha Gnanavel) (Female Version) [SmXnQZ0Hvjw].mp3",
    artist: "Umair Jaiswal",
    artistImg: "imges/artists/umari jaiswal.jpeg",
  },
  {
    id: 4,
    songTitle: "Rathinamo",
    SongCover: "imges/songs/rathinamo.png",
    song: "songs/Rathinamo (feat. Tanisha Gnanavel) (Female Version) [SmXnQZ0Hvjw].mp3",
    artist: "Tanisha Gnanavel",
    artistImg: "imges/artists/tanisha gnanavel.jpeg",
  },
];

// Audio Player State
let currentAudio = new Audio();
let currentSongIndex = 0;
let isShuffle = false;
let isRepeat = false;

// Render Song & Artist Cards
let songsHTML = "";
let artistsHTML = "";

api.forEach((item, index) => {
  songsHTML += `
    <div class="cards" data-id="${item.id}">
      <div class="songImg">
        <img src="${item.SongCover}" alt="${item.songTitle}">
        <div class="playBtn playBtnTrigger" data-index="${index}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/>
          </svg>
        </div>
      </div>
      <h4 class="songName underLine">${item.songTitle}</h4>
      <p class="artist scaleAndWhiteText underLine">${item.artist}</p>
    </div>
  `;

  artistsHTML += `
    <div class="cards">
      <div class="artistImg">
        <img src="${item.artistImg}" alt="${item.artist}">
        <div class="playBtn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/>
          </svg>
        </div>
      </div>
      <h4 class="artistName underLine">${item.artist}</h4>
      <p class="title scaleAndWhiteText underLine">Artist</p>
    </div>
  `;
});

songCards.innerHTML = songsHTML;
artistDetails.innerHTML = artistsHTML;

// Create Library Popup Toggle
createBtn.addEventListener("click", () => {
  createLibraryPopUp.classList.toggle("show");
  createSvg.classList.toggle("rotate45");
});

// Search Filter
search.addEventListener("input", () => {
  const searchValue = search.value.toLowerCase().trim();
  const allCards = document.querySelectorAll(".cards");

  allCards.forEach((card) => {
    const cardText = card.textContent.toLowerCase();
    card.style.display = cardText.includes(searchValue) ? "flex" : "none";
  });
});

// Helper: Format Seconds to MM:SS
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Helper: Update Play/Pause Button Icons
function updatePlayPauseUI(isPlaying) {
  if (isPlaying) {
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
  } else {
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  }
}

// Load and Play Song by Index
function loadAndPlaySong(index) {
  currentSongIndex = index;
  const selectedSong = api[currentSongIndex];

  modalImg.src = selectedSong.SongCover;
  modalTitle.textContent = selectedSong.songTitle;
  modalArtist.textContent = selectedSong.artist;

  currentAudio.src = selectedSong.song;
  currentAudio.play();
  updatePlayPauseUI(true);
}

// Open Song Popup on Card Play Button Click
const playButtons = document.querySelectorAll(".playBtnTrigger");
playButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const index = Number(btn.getAttribute("data-index"));
    loadAndPlaySong(index);
    popUpOverlay.classList.add("show");
  });
});

// 1. Play / Pause Toggle Button
playPauseBtn.addEventListener("click", () => {
  if (currentAudio.paused) {
    currentAudio.play();
    updatePlayPauseUI(true);
  } else {
    currentAudio.pause();
    updatePlayPauseUI(false);
  }
});

// 2. Backward Button: Single Click = Restart | Double Click = Previous Song
let clickTimer = null;

prevBtn.addEventListener("click", () => {
  if (clickTimer === null) {
    clickTimer = setTimeout(() => {
      // Single Click Action: Start song from beginning
      currentAudio.currentTime = 0;
      currentAudio.play();
      updatePlayPauseUI(true);
      clickTimer = null;
    }, 250);
  } else {
    // Double Click Action: Jump to previous song
    clearTimeout(clickTimer);
    clickTimer = null;
    const prevIndex = (currentSongIndex - 1 + api.length) % api.length;
    loadAndPlaySong(prevIndex);
  }
});

// 3. Next Song Button (Single Click)
function playNextSong() {
  if (isShuffle) {
    let randomIndex = Math.floor(Math.random() * api.length);
    loadAndPlaySong(randomIndex);
  } else {
    const nextIndex = (currentSongIndex + 1) % api.length;
    loadAndPlaySong(nextIndex);
  }
}

nextBtn.addEventListener("click", playNextSong);

// 4. Shuffle Toggle Button
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

// 5. Repeat Toggle Button
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
});

// Progress Bar Sync with Audio Time
currentAudio.addEventListener("timeupdate", () => {
  if (currentAudio.duration) {
    const progressPercent = (currentAudio.currentTime / currentAudio.duration) * 100;
    progressBar.value = progressPercent;
    currentTimeEl.textContent = formatTime(currentAudio.currentTime);
    totalDurationEl.textContent = formatTime(currentAudio.duration);
  }
});

// Seek Song when User Drags Progress Bar
progressBar.addEventListener("input", () => {
  if (currentAudio.duration) {
    const seekTime = (progressBar.value / 100) * currentAudio.duration;
    currentAudio.currentTime = seekTime;
  }
});

// Auto-play Next or Repeat when Song Ends
currentAudio.addEventListener("ended", () => {
  if (isRepeat) {
    currentAudio.currentTime = 0;
    currentAudio.play();
  } else {
    playNextSong();
  }
});

// Close Popup & Pause Audio
function closePlayerPopup() {
  popUpOverlay.classList.remove("show");
  currentAudio.pause();
  updatePlayPauseUI(false);
}

closeModalBtn.addEventListener("click", closePlayerPopup);

popUpOverlay.addEventListener("click", (e) => {
  if (e.target === popUpOverlay) {
    closePlayerPopup();
  }
});