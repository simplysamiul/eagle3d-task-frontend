export const API_BASE_URL = "https://eagle3d-task-backend.vercel.app";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // if backend sets cookies
        ...options,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "API error");
    }

    return res.json();
}
