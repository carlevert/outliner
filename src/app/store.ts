import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import {treeReducer} from "../features/tree/treeSlice";
import logger from "redux-logger";

export const store = configureStore({
    reducer: {
        treeReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
