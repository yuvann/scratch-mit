import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    spriteCords: {
        "CAT": {},
        "BEAR": {}
    },
    requestedFlowPlays: [],
    flowsRunning: [],
};

const canvasStateSlice = createSlice({
    name: 'canvasStateSlice',
    initialState: initialState,
    reducers: {
        setRequestedFlowPlays(state, action) {
            const isFound = !!state.requestedFlowPlays.find((e) => e.flowId === action.payload.flowId);
            if (isFound) {
                return;
            }
            state.requestedFlowPlays.push(action.payload);
            return state;
        },
        updateRequestedFlowPlays(state, action) {
            const { index } = action.payload;
            if (index < 0 ) {
                return;
            }
            state.requestedFlowPlays[index] = { ...state.requestedFlowPlays[index], ...(action.payload.data ?? {}) };
            return state;
        },
        deleteRequestedFlowPlays(state, action) {
            const { index } = action.payload;
            if (index < 0 ) {
                return;
            }
            state.requestedFlowPlays.splice(index, 1);
            return state;
        },
        setSpriteConfig(state, action) {
            state.spriteCords[action.payload.spriteName] = { ...(state.spriteCords[action.payload.spriteName] ?? {} ), ...action.payload.data };
            return state;
        },
    },
});

export const {
    setRequestedFlowPlays,
    setSpriteConfig,
    updateRequestedFlowPlays,
} = canvasStateSlice.actions;


export const canvasStateReducer = canvasStateSlice.reducer;
