document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['needsRestart'], (result) => {
    if (result.needsRestart) {
      document.getElementById('restartWarning').style.display = 'block';
    }
  });
});
