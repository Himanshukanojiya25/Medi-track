import { loginService } from "../../services/auth";
import { LoginPayload, LoginResponse } from "../../services/auth";

/**
 * Frontend Auth Controller
 * Backend controller discipline follow karta hai
 */
export const authController = {
  /**
   * Login controller
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    // 1️⃣ Guard (controller-level, not UI)
    if (!payload.email || !payload.password) {
      throw new Error("Email and password are required");
    }

    // 2️⃣ Delegate to service
    const response = await loginService({
      email: payload.email.trim(),
      password: payload.password,
    });

    // 3️⃣ Normalize / return
    return response;
  },
};
