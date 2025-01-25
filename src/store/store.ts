import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import resultReducer from './reducers/resultReducer';
import { quizzesApi } from '../services/quizzesApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    results: resultReducer,
    [quizzesApi.reducerPath]: quizzesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(quizzesApi.middleware), 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;