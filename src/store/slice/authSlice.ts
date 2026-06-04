import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Store } from '@reduxjs/toolkit';
import { api, apiPrivate, injectLogoutHandler } from '../../api/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null; // refresh token lives in httpOnly cookie only
  isAuthenticated: boolean;
  isInitializing: boolean;
  authStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  authError: string | null;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,
  authStatus: 'idle',
  authError: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isInitializing = false;
      state.authError = null;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    logOutSuccess: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.authStatus = 'idle';
      state.authError = null;
    },
    setInitialized: (state) => {
      state.isInitializing = false;
    },
  },
  extraReducers: (builder) => {
    // ── login ─────────────────────────────────────────────────────────────────
    builder
      .addCase(loginThunk.pending, (state) => {
        state.authStatus = 'loading';
        state.authError = null;
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.authStatus = 'succeeded';
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.authStatus = 'failed';
        state.authError = payload as string;
      });

    // ── register ──────────────────────────────────────────────────────────────
    builder
      .addCase(registerThunk.pending, (state) => {
        state.authStatus = 'loading';
        state.authError = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.authStatus = 'succeeded';
      })
      .addCase(registerThunk.rejected, (state, { payload }) => {
        state.authStatus = 'failed';
        state.authError = payload as string;
      });
  },
});

export const { setCredentials, setAccessToken, logOutSuccess, setInitialized } = authSlice.actions;
export default authSlice.reducer;

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (body: { email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', body);
      dispatch(setCredentials({
        user: res.data.data.user,
        accessToken: res.data.accessToken,
      }));
    } catch {
      return rejectWithValue('Login failed');
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (body: { name: string; email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/auth/register', body);
      dispatch(setCredentials({
        user: res.data.data.user,
        accessToken: res.data.accessToken,
      }));
    } catch {
      return rejectWithValue('Registration failed');
    }
  }
);

export const fetchMeThunk = createAsyncThunk(
  'auth/me',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiPrivate.get('/auth/me');
      dispatch(setCredentials({
        user: res.data.data.user,
        accessToken: res.data.accessToken,
      }));
    } catch {
      dispatch(logOutSuccess());
      return rejectWithValue('Session expired');
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await api.post('/auth/logout');
    } finally {
      dispatch(logOutSuccess());
    }
  }
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCurrentUser     = (state: { auth: AuthState }) => state.auth.user;
export const selectAccessToken     = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsInitializing  = (state: { auth: AuthState }) => state.auth.isInitializing;
export const selectIsAuthLoading   = (state: { auth: AuthState }) => state.auth.authStatus === 'loading';
export const selectAuthError       = (state: { auth: AuthState }) => state.auth.authError;

// ─── Logout handler injection ─────────────────────────────────────────────────

export function setupAuthLogoutHandler(store: Store) {
  injectLogoutHandler(() => {
    store.dispatch(logOutSuccess());
  });
}