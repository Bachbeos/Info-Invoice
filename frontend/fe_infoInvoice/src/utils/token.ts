import { Cookies } from "react-cookie";

const ACCESS_TOKEN_KEY = "accessToken";
const cookies = new Cookies();

export function getToken(): string {
  try {
    return cookies.get(ACCESS_TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setToken(token: string): void {
  try {
    cookies.set(ACCESS_TOKEN_KEY, token, {
      path: "/",
      sameSite: "lax",
      secure: window.location.protocol === "https:",
    });
  } catch {
    // Ignore storage errors
  }
}

export function clearToken(): void {
  try {
    cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  } catch {
    // Ignore storage errors
  }
}
