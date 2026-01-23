import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './features/editor/editorSlice';
import templateReducer from './features/templates/templatesSlice';
import shopReducer from './features/shop/shopSlice';
import authReducer from './features/auth/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      editor: editorReducer,
      template: templateReducer,
      shop: shopReducer,
      auth: authReducer,
    },
  });
};

// 2. Create the ACTUAL store instance (the object)
export const store = makeStore();

// Types to help TypeScript know what's in your store
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];