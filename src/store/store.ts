import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setupAuthLogoutHandler } from './slice/authSlice';
import contactReducer from './slice/contactSlice';
import galleryReducer from "./slice/gallerySlice"
import heroReducer from './slice/heroSlice';
import storyReducer from './slice/storySlice';
import servicesReducer from "./slice/servicesSlice"
import coverageReducer from "./slice/coverageSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contact: contactReducer,
    gallery: galleryReducer,
    hero: heroReducer,
    story:   storyReducer,
    services: servicesReducer,
    coverage: coverageReducer
  },
});

setupAuthLogoutHandler(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;