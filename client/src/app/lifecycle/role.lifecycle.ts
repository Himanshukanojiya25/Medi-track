import type { AppRole } from "../constants";

class RoleLifecycle {
  private role: AppRole = "public";

  setRole(role: AppRole) {
    this.role = role;
  }

  getRole() {
    return this.role;
  }
}

export const roleLifecycle = new RoleLifecycle();
