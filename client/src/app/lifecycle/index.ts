import { appLifecycle } from "./app.lifecycle";
import { networkLifecycle } from "./network.lifecycle";
import { visibilityLifecycle } from "./visibility.lifecycle";
import { sessionLifecycle } from "./session.lifecycle";
import { roleLifecycle } from "./role.lifecycle";
import { subscriptionLifecycle } from "./subscription.lifecycle";

export function initLifecycles() {
  networkLifecycle.init();
  visibilityLifecycle.init();
  sessionLifecycle.init();
  appLifecycle.start();
}

export {
  appLifecycle,
  networkLifecycle,
  visibilityLifecycle,
  sessionLifecycle,
  roleLifecycle,
  subscriptionLifecycle,
};
