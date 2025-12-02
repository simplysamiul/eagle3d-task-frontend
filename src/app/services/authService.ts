import { API_BASE_URL } from "./apiClient";
// import Cookies from "js-cookie";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  email: string;
  message: string;
  token:string;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Login failed");
  }

  const data: LoginResponse = await res.json();

  return data; 
}
