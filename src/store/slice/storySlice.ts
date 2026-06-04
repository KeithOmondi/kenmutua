import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { api, apiPrivate } from '../../api/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OriginContent {
  id: string;
  origin_label: string;
  origin_title: string;
  origin_emphasis: string;
  origin_body: string;
  origin_quote: string;
  origin_detail: string;
  created_at?: string;   // added for completeness
  updated_at: string;
}

export interface TimelineEntry {
  id: string;
  year: string;
  heading: string;
  description: string;   // matches backend column 'description'
  tag: string;
  dot: string;
  active: boolean;
  is_now: boolean;       // matches backend 'is_now'
  sort_order: number;
  created_at: string;
  updated_at?: string;   // added for completeness
}

export interface UpdateOriginInput {
  origin_label?: string;
  origin_title?: string;
  origin_emphasis?: string;
  origin_body?: string;
  origin_quote?: string;
  origin_detail?: string;
}

export interface TimelineEntryInput {
  year: string;
  heading: string;
  description: string;
  tag: string;
  dot: string;
  active?: boolean;
  is_now?: boolean;
  sort_order?: number;
}

interface StoryState {
  origin: OriginContent | null;
  timeline: TimelineEntry[];
  isFetching: boolean;
  isUpdatingOrigin: boolean;
  isSubmittingEntry: boolean;
  error: string | null;
}

interface BackendErrorResponse {
  message?: string;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: StoryState = {
  origin: null,
  timeline: [],
  isFetching: false,
  isUpdatingOrigin: false,
  isSubmittingEntry: false,
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchStoryContent = createAsyncThunk<
  { origin: OriginContent; timeline: TimelineEntry[] },
  void,
  { rejectValue: string }
>('story/fetchContent', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/story');
    // Backend returns { status: 'success', data: { origin, timeline } }
    return res.data.data;
  } catch (err: unknown) {
    if (axios.isAxiosError<BackendErrorResponse>(err)) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to load story content.');
    }
    return rejectWithValue('An unexpected error occurred.');
  }
});

export const updateOriginContent = createAsyncThunk<
  OriginContent,
  UpdateOriginInput,
  { rejectValue: string }
>('story/updateOrigin', async (body, { rejectWithValue }) => {
  try {
    const res = await apiPrivate.patch('/story/origin', body);
    return res.data.data.origin;
  } catch (err: unknown) {
    if (axios.isAxiosError<BackendErrorResponse>(err)) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to update origin content.');
    }
    return rejectWithValue('An unexpected error occurred.');
  }
});

export const createTimelineEntry = createAsyncThunk<
  TimelineEntry,
  TimelineEntryInput,
  { rejectValue: string }
>('story/createTimelineEntry', async (body, { rejectWithValue }) => {
  try {
    const res = await apiPrivate.post('/story/timeline', body);
    return res.data.data.entry;
  } catch (err: unknown) {
    if (axios.isAxiosError<BackendErrorResponse>(err)) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to create timeline entry.');
    }
    return rejectWithValue('An unexpected error occurred.');
  }
});

export const updateTimelineEntry = createAsyncThunk<
  TimelineEntry,
  { id: string } & Partial<TimelineEntryInput>,
  { rejectValue: string }
>('story/updateTimelineEntry', async ({ id, ...body }, { rejectWithValue }) => {
  try {
    const res = await apiPrivate.patch(`/story/timeline/${id}`, body);
    return res.data.data.entry;
  } catch (err: unknown) {
    if (axios.isAxiosError<BackendErrorResponse>(err)) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to update timeline entry.');
    }
    return rejectWithValue('An unexpected error occurred.');
  }
});

export const deleteTimelineEntry = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('story/deleteTimelineEntry', async (id, { rejectWithValue }) => {
  try {
    await apiPrivate.delete(`/story/timeline/${id}`);
    return id;
  } catch (err: unknown) {
    if (axios.isAxiosError<BackendErrorResponse>(err)) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to delete timeline entry.');
    }
    return rejectWithValue('An unexpected error occurred.');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    clearStoryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchStoryContent
      .addCase(fetchStoryContent.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchStoryContent.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.origin = payload.origin;
        state.timeline = payload.timeline;
      })
      .addCase(fetchStoryContent.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload ?? 'Failed to load story content.';
      })
      // updateOriginContent
      .addCase(updateOriginContent.pending, (state) => {
        state.isUpdatingOrigin = true;
        state.error = null;
      })
      .addCase(updateOriginContent.fulfilled, (state, { payload }) => {
        state.isUpdatingOrigin = false;
        state.origin = payload;
      })
      .addCase(updateOriginContent.rejected, (state, { payload }) => {
        state.isUpdatingOrigin = false;
        state.error = payload ?? 'Failed to update origin content.';
      })
      // createTimelineEntry
      .addCase(createTimelineEntry.pending, (state) => {
        state.isSubmittingEntry = true;
        state.error = null;
      })
      .addCase(createTimelineEntry.fulfilled, (state, { payload }) => {
        state.isSubmittingEntry = false;
        state.timeline = [...state.timeline, payload].sort((a, b) => a.sort_order - b.sort_order);
      })
      .addCase(createTimelineEntry.rejected, (state, { payload }) => {
        state.isSubmittingEntry = false;
        state.error = payload ?? 'Failed to create timeline entry.';
      })
      // updateTimelineEntry
      .addCase(updateTimelineEntry.pending, (state) => {
        state.isSubmittingEntry = true;
        state.error = null;
      })
      .addCase(updateTimelineEntry.fulfilled, (state, { payload }) => {
        state.isSubmittingEntry = false;
        state.timeline = state.timeline
          .map((e) => (e.id === payload.id ? payload : e))
          .sort((a, b) => a.sort_order - b.sort_order);
      })
      .addCase(updateTimelineEntry.rejected, (state, { payload }) => {
        state.isSubmittingEntry = false;
        state.error = payload ?? 'Failed to update timeline entry.';
      })
      // deleteTimelineEntry
      .addCase(deleteTimelineEntry.pending, (state) => {
        state.isSubmittingEntry = true;
        state.error = null;
      })
      .addCase(deleteTimelineEntry.fulfilled, (state, { payload }) => {
        state.isSubmittingEntry = false;
        state.timeline = state.timeline.filter((e) => e.id !== payload);
      })
      .addCase(deleteTimelineEntry.rejected, (state, { payload }) => {
        state.isSubmittingEntry = false;
        state.error = payload ?? 'Failed to delete timeline entry.';
      });
  },
});

export const { clearStoryError } = storySlice.actions;
export default storySlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

type StoryRootState = { story: StoryState };

export const selectOriginContent = (s: StoryRootState) => s.story.origin;
export const selectTimeline = (s: StoryRootState) => s.story.timeline;
export const selectStoryIsFetching = (s: StoryRootState) => s.story.isFetching;
export const selectIsUpdatingOrigin = (s: StoryRootState) => s.story.isUpdatingOrigin;
export const selectIsSubmittingEntry = (s: StoryRootState) => s.story.isSubmittingEntry;
export const selectStoryError = (s: StoryRootState) => s.story.error;