class VisibilityLifecycle {
  private visible = !document.hidden;

  init() {
    document.addEventListener("visibilitychange", this.handleChange);
  }

  private handleChange = () => {
    this.visible = !document.hidden;
    console.info("[visibility]", this.visible ? "visible" : "hidden");
  };

  isVisible() {
    return this.visible;
  }
}

export const visibilityLifecycle = new VisibilityLifecycle();
