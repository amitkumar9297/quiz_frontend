import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import resultReducer from './reducers/resultReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    results: resultReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;