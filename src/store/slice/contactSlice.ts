import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { api, apiPrivate } from '../../api/api';

// Define structural types mirroring our database entity schema
export interface InquiryInput {
  name: string;
  phone: string;
  service: string;
  message: string;
}

export interface Inquiry extends InquiryInput {
  id: string;
  is_processed: boolean;
  created_at: string;
}

interface ContactState {
  inquiries: Inquiry[];
  isSubmitting: boolean;
  isLoadingQueue: boolean;
  submitSuccess: boolean;
  error: string | null;
}

// Define the shape of our backend error response structure
interface BackendErrorResponse {
  message?: string;
  status?: string;
}

const initialState: ContactState = {
  inquiries: [],
  isSubmitting: false,
  isLoadingQueue: false,
  submitSuccess: false,
  error: null,
};

/**
 * Thunk: Public entry submission action
 * Fires against the public axios instance
 */
export const submitInquiry = createAsyncThunk<
  { status: string; data: { inquiry: Inquiry } }, // Expected fulfilled return type
  InquiryInput,                                   // First argument type
  { rejectValue: string }                         // Config object type for rejectWithValue
>(
  'contact/submitInquiry',
  async (inquiryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/contact/create', inquiryData);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError<BackendErrorResponse>(err)) {
        return rejectWithValue(
          err.response?.data?.message || 'Failed to dispatch form submission details.'
        );
      }
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);

/**
 * Thunk: Admin tracking queue retrieval action
 * Fires against the secure authenticated interceptor instance
 */
export const fetchInquiriesQueue = createAsyncThunk<
  Inquiry[],              // Expected fulfilled return type
  void,                   // No argument passed to this thunk
  { rejectValue: string } // Config object type for rejectWithValue
>(
  'contact/fetchInquiriesQueue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiPrivate.get('/contact/get');
      return response.data.data.inquiries;
    } catch (err: unknown) {
      if (axios.isAxiosError<BackendErrorResponse>(err)) {
        return rejectWithValue(
          err.response?.data?.message || 'Failed to synchronize inquiry data tables.'
        );
      }
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    // Reset state flags cleanly when mounting or unmounting the contact UI component
    resetSubmitStatus: (state) => {
      state.submitSuccess = false;
      state.error = null;
      state.isSubmitting = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Submit Form Lifecycle Handling ---
      .addCase(submitInquiry.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(submitInquiry.fulfilled, (state) => {
        state.isSubmitting = false;
        state.submitSuccess = true;
      })
      .addCase(submitInquiry.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitSuccess = false;
        state.error = action.payload ?? 'Failed to submit inquiry.';
      })

      // --- Admin Fetch Lifecycle Handling ---
      .addCase(fetchInquiriesQueue.pending, (state) => {
        state.isLoadingQueue = true;
        state.error = null;
      })
      .addCase(fetchInquiriesQueue.fulfilled, (state, action: PayloadAction<Inquiry[]>) => {
        state.isLoadingQueue = false;
        state.inquiries = action.payload;
      })
      .addCase(fetchInquiriesQueue.rejected, (state, action) => {
        state.isLoadingQueue = false;
        state.error = action.payload ?? 'Failed to fetch inquiries.';
      });
  },
});

export const { resetSubmitStatus } = contactSlice.actions;
export default contactSlice.reducer;

// --- Context Selectors for UI state tracking ---
export const selectInquiriesQueue = (state: { contact: ContactState }) => state.contact.inquiries;
export const selectIsSubmitting = (state: { contact: ContactState }) => state.contact.isSubmitting;
export const selectSubmitSuccess = (state: { contact: ContactState }) => state.contact.submitSuccess;
export const selectIsLoadingQueue = (state: { contact: ContactState }) => state.contact.isLoadingQueue;
export const selectContactError = (state: { contact: ContactState }) => state.contact.error;