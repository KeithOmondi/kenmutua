import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { api, apiPrivate } from '../../api/api';

export interface Service {
  id: string;
  icon: string;
  name: string;
  description: string;
  tags: string[];
  highlight: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceInput {
  icon: string;
  name: string;
  description: string;
  tags: string[];
  highlight?: boolean;
  sort_order?: number;
}

interface ServicesState {
  services: Service[];
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  isFetching: false,
  isSubmitting: false,
  error: null,
};

export const fetchServices = createAsyncThunk<
  Service[],
  void,
  { rejectValue: string }
>('services/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/services');
    return res.data.data.services;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to load services.');
    }
    return rejectWithValue('An unexpected error occurred.');
  }
});

export const createService = createAsyncThunk<
  Service,
  ServiceInput,
  { rejectValue: string }
>('services/create', async (body, { rejectWithValue }) => {
  try {
    const res = await apiPrivate.post('/services', body);
    return res.data.data.service;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to create service.');
    }
    return rejectWithValue('An unexpected error occurred.');
  }
});

export const updateService = createAsyncThunk<
  Service,
  { id: string } & Partial<ServiceInput>,
  { rejectValue: string }
>('services/update', async ({ id, ...body }, { rejectWithValue }) => {
  try {
    const res = await apiPrivate.patch(`/services/${id}`, body);
    return res.data.data.service;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to update service.');
    }
    return rejectWithValue('An unexpected error occurred.');
  }
});

export const deleteService = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('services/delete', async (id, { rejectWithValue }) => {
  try {
    await apiPrivate.delete(`/services/${id}`);
    return id;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to delete service.');
    }
    return rejectWithValue('An unexpected error occurred.');
  }
});

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearServicesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.services = payload;
      })
      .addCase(fetchServices.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.error = payload ?? 'Failed to load services.';
      })
      .addCase(createService.fulfilled, (state, { payload }) => {
        state.services = [...state.services, payload].sort((a, b) => a.sort_order - b.sort_order);
      })
      .addCase(updateService.fulfilled, (state, { payload }) => {
        state.services = state.services
          .map((s) => (s.id === payload.id ? payload : s))
          .sort((a, b) => a.sort_order - b.sort_order);
      })
      .addCase(deleteService.fulfilled, (state, { payload }) => {
        state.services = state.services.filter((s) => s.id !== payload);
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isSubmitting = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
        (state) => {
          state.isSubmitting = false;
        }
      );
  },
});

export const { clearServicesError } = servicesSlice.actions;
export default servicesSlice.reducer;

// Selectors
type RootState = { services: ServicesState };
export const selectAllServices = (state: RootState) => state.services.services;
export const selectServicesFetching = (state: RootState) => state.services.isFetching;
export const selectServicesError = (state: RootState) => state.services.error;