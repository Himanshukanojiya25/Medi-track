class NetworkLifecycle {
  private online = navigator.onLine;

  init() {
    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);
  }

  private handleOnline = () => {
    this.online = true;
    console.info("[network] online");
  };

  private handleOffline = () => {
    this.online = false;
    console.warn("[network] offline");
  };

  isOnline() {
    return this.online;
  }
}

export const networkLifecycle = new NetworkLifecycle();
