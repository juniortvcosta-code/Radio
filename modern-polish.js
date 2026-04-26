(function () {
  "use strict";

  // Paste your direct radio stream URL between the quotes.
  var RADIO_STREAM_URL = "https://cast2.my-control-panel.com/proxy/radiovo3/stream2";

  var page = document.querySelector(".voz-page");
  var playButton = document.querySelector(".play-btn");
  var liveText = document.querySelector(".live-badge span");
  var volume = document.querySelector(".vol-slider");
  var muteButton = document.querySelector(".vol-icon");
  var audio = document.querySelector("audio");
  var streamError = document.querySelector(".stream-error");

  function setVolumeFill(value) {
    if (!volume) return;
    var percent = Math.round(Number(value) * 100);
    volume.style.background = "linear-gradient(to right, var(--gold) 0%, var(--gold) " + percent + "%, var(--cream-faint) " + percent + "%, var(--cream-faint) 100%)";
  }

  function setPlaying(isPlaying) {
    page.classList.toggle("is-playing", isPlaying);
    playButton.setAttribute("aria-pressed", String(isPlaying));
    playButton.setAttribute("aria-label", isPlaying ? "Pausar" : "Reproducir");
    if (liveText) {
      liveText.textContent = isPlaying ? "Transmitiendo en Vivo" : "Escúchanos en Vivo";
    }
  }

  function showStreamMessage(message) {
    if (streamError) {
      streamError.textContent = message || "";
    }
  }

  if (playButton && page) {
    playButton.addEventListener("click", function () {
      var shouldPlay = !page.classList.contains("is-playing");

      if (!audio || !RADIO_STREAM_URL) {
        setPlaying(shouldPlay);
        showStreamMessage(RADIO_STREAM_URL ? "" : "Agrega tu URL de streaming en modern-polish.js");
        return;
      }

      if (!audio.src) {
        audio.src = RADIO_STREAM_URL;
      }

      if (shouldPlay) {
        audio.play().then(function () {
          setPlaying(true);
          showStreamMessage("");
        }).catch(function () {
          setPlaying(false);
          showStreamMessage("No se pudo reproducir la señal. Revisa la URL del stream.");
        });
      } else {
        audio.pause();
        setPlaying(false);
        showStreamMessage("");
      }
    });
  }

  if (volume) {
    setVolumeFill(volume.value);
    if (audio) {
      audio.volume = Number(volume.value);
    }
    volume.addEventListener("input", function () {
      setVolumeFill(volume.value);
      if (audio) {
        audio.volume = Number(volume.value);
        audio.muted = Number(volume.value) === 0;
      }
    });
  }

  if (muteButton && volume) {
    muteButton.addEventListener("click", function () {
      volume.value = Number(volume.value) > 0 ? "0" : "0.8";
      setVolumeFill(volume.value);
      if (audio) {
        audio.volume = Number(volume.value);
        audio.muted = Number(volume.value) === 0;
      }
    });
  }
})();
