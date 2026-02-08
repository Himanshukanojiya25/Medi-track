type LifecycleCallback = () => void;

class AppLifecycle {
  private started = false;
  private callbacks: LifecycleCallback[] = [];

  start() {
    if (this.started) return;
    this.started = true;
    this.callbacks.forEach(cb => cb());
  }

  onStart(cb: LifecycleCallback) {
    this.callbacks.push(cb);
  }
}

export const appLifecycle = new AppLifecycle();
