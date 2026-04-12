class AudioEngine {
  constructor() {
    this.isMuted = true;
  }
  async init() { return Promise.resolve(); }
  toggleMute() { return true; }
  setRouteActive() {}
  playClick() {}
  playHover() {}
  playDeepHover() {}
  playMenuOpen() {}
  playMenuClose() {}
  playPreheadPing() {}
  playStatementReveal() {}
  playStatementBullet() {}
  playFormInteraction() {}
  playCarouselLock() {}
}
const audio = new AudioEngine();
export { audio };
export default audio;
