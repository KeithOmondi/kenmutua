import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { api, apiPrivate } from '../../api/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface County {
  name: string;
  label: string;
}

export interface HeroContent {
  id: string;
  tag_line: string;
  headline: string;
  headline_emphasis: string;
  subtitle: string;
  primary_btn_label: string;
  primary_btn_href: string;
  secondary_btn_label: string;
  secondary_btn_href: string;
  image_url: string | null;
  image_public_id: string | null;
  image_alt: string | null;
  counties: County[];
  updated_at: string;
}

export interface UpdateHeroInput {
  tag_line?: string;
  headline?: string;
  headline_emphasis?: string;
  subtitle?: string;
  primary_btn_label?: string;
  primary_btn_href?: string;
  secondary_btn_label?: string;
  secondary_btn_href?: string;
  image_alt?: string;
  counties?: County[];
}

interface HeroState {
  content: HeroContent | null;
  isFetching: boolean;
  isUpdating: boolean;
  isUploadingImage: boolean;
  error: string | null;
}

interface BackendErrorResponse {
  message?: string;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: HeroState = {
  content: null,
  isFetching: false,
  isUpdating: false,
  isUploadingImage: false,
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchHeroContent = createAsyncThunk <
  HeroContent,
  void,
  { rejectValue: string }
>(
  'hero/fetchContent',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/hero/get');
      return res.data.data.hero;
    } catch (err: unknown) {
      if (axios.isAxiosError<BackendErrorResponse>(err)) {
        return rejectWithValue(err.response?.data?.message ?? 'Failed to load hero content.');
      }
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);

export const updateHeroContent = createAsyncThunk <
  HeroContent,
  UpdateHeroInput,
  { rejectValue: string }
>(
  'hero/updateContent',
  async (body, { rejectWithValue }) => {
    try {
      const res = await apiPrivate.patch('/hero/update', body);
      return res.data.data.hero;
    } catch (err: unknown) {
      if (axios.isAxiosError<BackendErrorResponse>(err)) {
        return rejectWithValue(err.response?.data?.message ?? 'Failed to update hero content.');
      }
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);

export const updateHeroImage = createAsyncThunk <
  HeroContent,
  File,
  { rejectValue: string }
>(
  'hero/updateImage',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await apiPrivate.patch('/hero/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data.hero;
    } catch (err: unknown) {
      if (axios.isAxiosError<BackendErrorResponse>(err)) {
        return rejectWithValue(err.response?.data?.message ?? 'Failed to upload hero image.');
      }
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const heroSlice = createSlice({
  name: 'hero',
  initialState,
  reducers: {
    clearHeroError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchHeroContent ──────────────────────────────────────────────────────
    builder
      .addCase(fetchHeroContent.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchHeroContent.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.content = payload;
      })
      .addCase(fetchHeroContent.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload ?? 'Failed to load hero content.';
      });

    // ── updateHeroContent ─────────────────────────────────────────────────────
    builder
      .addCase(updateHeroContent.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateHeroContent.fulfilled, (state, { payload }) => {
        state.isUpdating = false;
        state.content = payload;
      })
      .addCase(updateHeroContent.rejected, (state, { payload }) => {
        state.isUpdating = false;
        state.error = payload ?? 'Failed to update hero content.';
      });

    // ── updateHeroImage ───────────────────────────────────────────────────────
    builder
      .addCase(updateHeroImage.pending, (state) => {
        state.isUploadingImage = true;
        state.error = null;
      })
      .addCase(updateHeroImage.fulfilled, (state, { payload }) => {
        state.isUploadingImage = false;
        state.content = payload;
      })
      .addCase(updateHeroImage.rejected, (state, { payload }) => {
        state.isUploadingImage = false;
        state.error = payload ?? 'Failed to upload hero image.';
      });
  },
});

export const { clearHeroError } = heroSlice.actions;
export default heroSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

type HeroRootState = { hero: HeroState };

export const selectHeroContent       = (s: HeroRootState) => s.hero.content;
export const selectHeroIsFetching    = (s: HeroRootState) => s.hero.isFetching;
export const selectHeroIsUpdating    = (s: HeroRootState) => s.hero.isUpdating;
export const selectHeroIsUploading   = (s: HeroRootState) => s.hero.isUploadingImage;
export const selectHeroError         = (s: HeroRootState) => s.hero.error;