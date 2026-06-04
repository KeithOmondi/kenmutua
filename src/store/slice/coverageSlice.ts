import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { api, apiPrivate } from '../../api/api';

export interface Stat {
  num: string;
  label: string;
}

export interface CoverageMain {
  id: string;
  quote: string;
  body: string;
  stats: Stat[];
  updated_at: string;
}

export interface County {
  id: string;
  county_name: string;
  items: string[];
  sort_order: number;
}

export interface CoverageData {
  main: CoverageMain;
  counties: County[];
}

interface CoverageState {
  main: CoverageMain | null;
  counties: County[];
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: CoverageState = {
  main: null,
  counties: [],
  isFetching: false,
  isSubmitting: false,
  error: null,
};

export const fetchCoverage = createAsyncThunk<CoverageData, void, { rejectValue: string }>(
  'coverage/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/coverage');
      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message ?? 'Failed to load coverage.');
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);

export const updateCoverageMain = createAsyncThunk<CoverageMain, Partial<CoverageMain>, { rejectValue: string }>(
  'coverage/updateMain',
  async (body, { rejectWithValue }) => {
    try {
      const res = await apiPrivate.patch('/coverage/main', body);
      return res.data.data.main;
    } catch (err) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message ?? 'Failed to update main content.');
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);

export const createCounty = createAsyncThunk<County, Omit<County, 'id'>, { rejectValue: string }>(
  'coverage/createCounty',
  async (body, { rejectWithValue }) => {
    try {
      const res = await apiPrivate.post('/coverage/counties', body);
      return res.data.data.county;
    } catch (err) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message ?? 'Failed to create county.');
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);

export const updateCounty = createAsyncThunk<County, { id: string } & Partial<County>, { rejectValue: string }>(
  'coverage/updateCounty',
  async ({ id, ...body }, { rejectWithValue }) => {
    try {
      const res = await apiPrivate.patch(`/coverage/counties/${id}`, body);
      return res.data.data.county;
    } catch (err) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message ?? 'Failed to update county.');
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);

export const deleteCounty = createAsyncThunk<string, string, { rejectValue: string }>(
  'coverage/deleteCounty',
  async (id, { rejectWithValue }) => {
    try {
      await apiPrivate.delete(`/coverage/counties/${id}`);
      return id;
    } catch (err) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message ?? 'Failed to delete county.');
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);

const coverageSlice = createSlice({
  name: 'coverage',
  initialState,
  reducers: { clearCoverageError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoverage.pending, (state) => { state.isFetching = true; state.error = null; })
      .addCase(fetchCoverage.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.main = payload.main;
        state.counties = payload.counties;
      })
      .addCase(fetchCoverage.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload ?? 'Failed to load coverage.';
      })
      .addCase(updateCoverageMain.fulfilled, (state, { payload }) => { state.main = payload; })
      .addCase(createCounty.fulfilled, (state, { payload }) => {
        state.counties = [...state.counties, payload].sort((a, b) => a.sort_order - b.sort_order);
      })
      .addCase(updateCounty.fulfilled, (state, { payload }) => {
        state.counties = state.counties.map(c => c.id === payload.id ? payload : c).sort((a, b) => a.sort_order - b.sort_order);
      })
      .addCase(deleteCounty.fulfilled, (state, { payload }) => {
        state.counties = state.counties.filter(c => c.id !== payload);
      })
      .addMatcher(action => action.type.endsWith('/pending'), (state) => { state.isSubmitting = true; state.error = null; })
      .addMatcher(action => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'), (state) => { state.isSubmitting = false; });
  }
});

export const { clearCoverageError } = coverageSlice.actions;
export default coverageSlice.reducer;

// Selectors
type RootState = { coverage: CoverageState };
export const selectCoverageMain = (state: RootState) => state.coverage.main;
export const selectCoverageCounties = (state: RootState) => state.coverage.counties;
export const selectCoverageFetching = (state: RootState) => state.coverage.isFetching;
export const selectCoverageError = (state: RootState) => state.coverage.error;