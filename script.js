const fastForwardButton = document.getElementById("fast-forward-button");
const fastRewindButton = document.getElementById("fast-rewind-button");
const durationProgress = document.getElementById("duration-progress");
const arrowBackButton = document.getElementById("arrow-back-button");
const arrowNextButton = document.getElementById("arrow-next-button");
const scrollContainer = document.querySelector(".artists-content");
const favoriteButton = document.getElementById("favorite-button");
const favoriteImage = document.getElementById("favorite-image");
const progressRange = document.getElementById("progress-bar");
const playButtonImage = document.getElementById("play-image");
const audioSource = document.getElementById("hearify-source");
const replayButton = document.getElementById("replay-button");
const repeatButton = document.getElementById("repeat-button");
const volumeButton = document.getElementById("volume-button");
const durationDisplay = document.getElementById("duration");
const volumeRange = document.getElementById("volume-bar");
const playButton = document.getElementById("play-button");
const volumeImage = document.getElementById("volume-img");
const repeatImage = document.getElementById("repeat-img");
const audio = document.getElementById("hearify-audio");

const songs = [
  "./assets/songs/the-weeknd-blinding-lights.mp3",
  "./assets/songs/jack-jhonson-banana-pancakes.mp3",
  "./assets/songs/racionais-negro-drama.mp3",
  "./assets/songs/lady-gaga-shallow.mp3",
  "./assets/songs/Illusionize-moogzera.mp3",
];

let currentSongIndex = 0;
let currentSongTime = 0;
let isFavorite = false;
let isSeeking = false;
let isRepeat = false;
let duration = 0;
let volume = 0.5;

const playSong = () => {
  if (audio.paused) {
    audio.volume = volume;
    audio.play();
  } else {
    audio.pause();
  }
};

const handleSongQueue = (index, callback) => {
  const button = document.getElementById(`play-song-${index + 1}`);
  const songNumber = document.getElementById(`song-number-${index + 1}`);
  const songArticle = document.getElementById(`song${index + 1}`);

  if (currentSongIndex === index) {
    button.classList.remove("hide");
    button.classList.add("d-flex");
    songNumber.classList.add("hide");
    songArticle.classList.add("active");

    if (callback) {
      callback(index);
    }
  } else {
    button.classList.add("hide");
    button.classList.remove("d-flex");
    songNumber.classList.remove("hide");
    songArticle.classList.remove("active");
  }
};

function handleClickQueue(index) {
  return function () {
    if (currentSongIndex !== index) {
      currentSongIndex = index;

      audio.src = songs[currentSongIndex];
      audio.load();
      audio.addEventListener("canplay", () => {
        if (!isSeeking) {
          audio.play();
        }
      });
    }
  };
}

function onLoad() {
  audio.src = songs[currentSongIndex];
  if (audio) {
    audio.load();
  }
  songs.forEach((_, index) => {
    const button = document.getElementById(`play-song-${index + 1}`);
    const songArticle = document.getElementById(`song${index + 1}`);
    handleSongQueue(index);
    button.addEventListener("click", playSong);
    songArticle.addEventListener("click", handleClickQueue(index));
  });
}

audio.addEventListener("durationchange", () => {
  const _player = new Audio(songs[currentSongIndex]);

  _player.addEventListener(
    "durationchange",
    function () {
      if (this.duration != Infinity) {
        duration = this.duration;
        _player.remove();
      }
    },
    false
  );

  _player.load();
  _player.currentTime = 24 * 60 * 60;
  _player.volume = 0;
});

function repeat() {
  if (!audio.paused) {
    audio.pause();
  }
  audio.currentTime = 0;

  audio.play();
}

function nextSong() {
  if (currentSongIndex < 4) {
    currentSongIndex += 1;
  } else {
    currentSongIndex = 0;
  }

  audio.src = songs[currentSongIndex];
  audio.load();
  audio.addEventListener("canplay", () => {
    if (!isSeeking) {
      audio.play();
    }
  });
}

function updateProgress(e) {
  if (audio.paused) {
    return;
  }
  const currentTime = e.target.currentTime;

  const progressPercent = (currentTime / duration) * 100;
  progressRange.value = progressPercent;

  const currentMinutes = Math.floor(currentTime / 60);
  const currentSeconds = Math.floor(currentTime % 60);
  const durationMinutes = Math.floor(duration / 60);
  const durationSeconds = Math.floor(duration % 60);

  durationDisplay.textContent = `${formatTime(durationMinutes)}:${formatTime(
    durationSeconds
  )}`;

  durationProgress.textContent = `${formatTime(currentMinutes)}:${formatTime(
    currentSeconds
  )}`;
}

function handleEndSong() {
  if (isRepeat) {
    repeat();
    return;
  }

  if (currentSongIndex < 4) {
    nextSong();
    return;
  }

  audio.currentTime = 0;
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

function setAudioCurrentTime(currentTime) {
  if (
    !isNaN(audio.duration) &&
    isFinite(audio.duration) &&
    currentTime >= 0 &&
    currentTime <= audio.duration
  ) {
    audio.currentTime = currentTime;
  }
}

function handleProgressRangeChanged(e) {
  const progress = Number(e.target.value);

  if (audio?.currentTime >= 0 && duration >= 0 && progress >= 0) {
    const currentTime = (progress / 100) * duration;

    setAudioCurrentTime(currentTime);
  }
}

function handleRepeatClicked() {
  isRepeat = !isRepeat;
  if (isRepeat) {
    repeatImage.src = "./assets/icons/repeat-selected-icon.svg";
    return;
  }
  repeatImage.src = "./assets/icons/repeat-icon.svg";
}

function handleAudioPlay() {
  playButtonImage.src = "./assets/icons/pause-icon.svg";
  songs.forEach((_, index) => {
    handleSongQueue(index, (index) => {
      const img = document.getElementById(`play-song-image-${index + 1}`);
      img.src = "./assets/icons/pause-icon.svg";
    });
  });
}

function handleAudioPause() {
  playButtonImage.src = "./assets/icons/play-icon.svg";
  songs.forEach((_, index) => {
    if (currentSongIndex === index) {
      const img = document.getElementById(`play-song-image-${index + 1}`);
      img.src = "./assets/icons/play-icon.svg";
    }
  });
}

function handleFastRewindClicked() {
  if (currentSongIndex > 0) {
    currentSongIndex -= 1;
  } else {
    currentSongIndex = 4;
  }

  audio.src = songs[currentSongIndex];
  audio.play();
}

function handleVolumeChanged(e) {
  volume = e.target.value;
  audio.volume = volume;
  if (volume == 0) {
    volumeImage.src = "./assets/icons/volume-off-icon.svg";
    return;
  }
  volumeImage.src = "./assets/icons/volume-icon.svg";
}

function handleVolumeClicked() {
  if (audio.volume > 0) {
    volumeRange.value = 0;
    audio.volume = 0;
    volumeImage.src = "./assets/icons/volume-off-icon.svg";
    return;
  }

  volumeRange.value = volume;
  audio.volume = volume;
  volumeImage.src = "./assets/icons/volume-icon.svg";
}

function handleFavoriteClicked() {
  isFavorite = !isFavorite;

  if (isFavorite) {
    favoriteImage.src = "./assets/icons/favorite-selected-icon.svg";
    return;
  }

  favoriteImage.src = "./assets/icons/favorite-white-icon.svg";
}

function handleSlide(left) {
  return function () {
    scrollContainer.scrollBy({
      top: 0,
      left: left,
      behavior: "smooth",
    });
  };
}

window.addEventListener("load", onLoad);

audio.addEventListener("timeupdate", updateProgress);

playButton.addEventListener("click", playSong);

audio.addEventListener("ended", handleEndSong);

progressRange.addEventListener("change", handleProgressRangeChanged);

replayButton.addEventListener("click", repeat);

repeatButton.addEventListener("click", handleRepeatClicked);

fastForwardButton.addEventListener("click", nextSong);

audio.addEventListener("play", handleAudioPlay);

audio.addEventListener("pause", handleAudioPause);

fastRewindButton.addEventListener("click", handleFastRewindClicked);

volumeRange.addEventListener("input", handleVolumeChanged);

volumeButton.addEventListener("click", handleVolumeClicked);

favoriteButton.addEventListener("click", handleFavoriteClicked);

arrowBackButton.addEventListener("click", handleSlide(-400));

arrowNextButton.addEventListener("click", handleSlide(400));
