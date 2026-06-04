import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { api, apiPrivate } from '../../api/api';

export interface GalleryItem {
  id: number;
  image: string;
  label: string;
  caption: string;
  category: string;
  location: string;
}

interface GalleryState {
  items: GalleryItem[];
  isLoading: boolean;
  error: string | null;
}

interface BackendErrorPayload {
  message?: string;
}

const initialState: GalleryState = {
  items: [],
  isLoading: false,
  error: null,
};

/**
 * Thunk: Synchronize active gallery instances with server state records
 */
export const fetchGalleryItems = createAsyncThunk<
  GalleryItem[],
  void,
  { rejectValue: string }
>('gallery/fetchGalleryItems', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/gallery');
    return response.data.data.items;
  } catch (err: unknown) {
    if (axios.isAxiosError<BackendErrorPayload>(err)) {
      return rejectWithValue(err.response?.data?.message || 'Failed to sync farm gallery timeline logs.');
    }
    return rejectWithValue('An unexpected gallery asset synchronization exception occurred.');
  }
});

/**
 * Thunk: Stream multi-part binary payload directly to secure production nodes
 */
export const addGalleryItem = createAsyncThunk<
  GalleryItem,
  FormData,
  { rejectValue: string }
>('gallery/addGalleryItem', async (formData, { rejectWithValue }) => {
  try {
    const response = await apiPrivate.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.item;
  } catch (err: unknown) {
    if (axios.isAxiosError<BackendErrorPayload>(err)) {
      return rejectWithValue(err.response?.data?.message || 'Failed to dispatch new farm asset upload.');
    }
    return rejectWithValue('An unexpected server communication exception occurred during upload.');
  }
});

/**
 * Thunk: Dispatch target changes via multi-part payload constructors to existing record
 */
export const updateGalleryItem = createAsyncThunk<
  GalleryItem,
  { id: number; formData: FormData },
  { rejectValue: string }
>('gallery/updateGalleryItem', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await apiPrivate.put(`/gallery/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.item;
  } catch (err: unknown) {
    if (axios.isAxiosError<BackendErrorPayload>(err)) {
      return rejectWithValue(err.response?.data?.message || 'Failed to apply modifications to target gallery record.');
    }
    return rejectWithValue('An unexpected runtime exception occurred while transmitting asset update.');
  }
});

/**
 * Thunk: Terminate/Soft-delete dynamic registry entries within backend arrays
 */
export const deleteGalleryItem = createAsyncThunk<
  number, // Returns the targeted asset tracking ID to facilitate state tree optimization
  number,
  { rejectValue: string }
>('gallery/deleteGalleryItem', async (id, { rejectWithValue }) => {
  try {
    await apiPrivate.delete(`/gallery/${id}`);
    return id;
  } catch (err: unknown) {
    if (axios.isAxiosError<BackendErrorPayload>(err)) {
      return rejectWithValue(err.response?.data?.message || 'Failed to purge target asset from live data matrices.');
    }
    return rejectWithValue('An unexpected exception intercepted the asset erasure execution sequence.');
  }
});

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Fetch Gallery Items Case Matrix ---
      .addCase(fetchGalleryItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGalleryItems.fulfilled, (state, action: PayloadAction<GalleryItem[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchGalleryItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to complete gallery asset fetching pipeline.';
      })

      // --- Add Gallery Item Case Matrix ---
      .addCase(addGalleryItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addGalleryItem.fulfilled, (state, action: PayloadAction<GalleryItem>) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addGalleryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to append new media item into ecosystem records.';
      })

      // --- Update Gallery Item Case Matrix ---
      .addCase(updateGalleryItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGalleryItem.fulfilled, (state, action: PayloadAction<GalleryItem>) => {
        state.isLoading = false;
        const targetIndex = state.items.findIndex(item => item.id === action.payload.id);
        if (targetIndex !== -1) {
          state.items[targetIndex] = action.payload; // Inline substitution maintains list position and order metrics
        }
      })
      .addCase(updateGalleryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to apply modifications to local cache states.';
      })

      // --- Delete Gallery Item Case Matrix ---
      .addCase(deleteGalleryItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGalleryItem.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload); // Instant UI optimization removal
      })
      .addCase(deleteGalleryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to clear selected file item out of registry cache.';
      });
  },
});

export default gallerySlice.reducer;

export const selectGalleryItems = (state: { gallery: GalleryState }) => state.gallery.items;
export const selectIsGalleryLoading = (state: { gallery: GalleryState }) => state.gallery.isLoading;
export const selectGalleryError = (state: { gallery: GalleryState }) => state.gallery.error;