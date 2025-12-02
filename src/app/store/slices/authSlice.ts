import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { loginUser } from "@/app/services/authService";

// ===========================
// Types
// ===========================
interface LoginPayload {
  email: string;
  password: string;
}

interface User {
  email: string; // only non-sensitive info
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// ===========================
// Initial State
// ===========================
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// ===========================
// Login Thunk
// ===========================
export const login = createAsyncThunk<User, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await loginUser(payload); // backend returns { token, email }

      // Save token to cookie (HTTP-only cookie would be set by backend ideally)
      Cookies.set("token", data.token, {
        expires: 1 / 8, // 3 hours
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      // Return only user email for Redux store
      return { email: data.email };
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue("Something went wrong");
    }
  }
);

// ===========================
// Slice
// ===========================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // Clear Redux user
      state.user = null;
      state.error = null;

      // Remove cookie
      Cookies.remove("token", { path: "/" });

      // Optionally, you can call backend logout API here for full invalidation
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload; // store only email
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

// ===========================
export const { logout } = authSlice.actions;
export default authSlice.reducer;
