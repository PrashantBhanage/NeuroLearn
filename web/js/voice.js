let utterance = null;
let isSpeaking = false;

function speak(text) {
  stopVoice();

  utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.lang = "en-US";

  utterance.onend = () => {
    isSpeaking = false;
    updateMicState(false);
  };

  isSpeaking = true;
  updateMicState(true);

  window.speechSynthesis.speak(utterance);
}

function stopVoice() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  updateMicState(false);
}

function toggleVoice(text) {
  if (isSpeaking) {
    stopVoice();
  } else {
    speak(text);
  }
}

function updateMicState(active) {
  document.querySelectorAll(".mic-btn").forEach(btn => {
    btn.classList.toggle("active", active);
  });
}

window.addEventListener("beforeunload", stopVoice);
