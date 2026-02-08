class SessionLifecycle {
  private lastActive = Date.now();

  init() {
    ["click", "keydown", "mousemove"].forEach(evt =>
      window.addEventListener(evt, this.touch)
    );
  }

  private touch = () => {
    this.lastActive = Date.now();
  };

  getLastActive() {
    return this.lastActive;
  }

  isIdle(maxIdleMs: number) {
    return Date.now() - this.lastActive > maxIdleMs;
  }
}

export const sessionLifecycle = new SessionLifecycle();
