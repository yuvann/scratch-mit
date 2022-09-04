import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sprites: {
        "CAT": {
            currentFlow: 0,
            flows: [
                {
                    id: '10001',
                    blocks: []
                },
                {
                    id: '10002',
                    blocks: []
                },
                {
                    id: '10003',
                    blocks: []
                },
                {
                    id: '10004',
                    blocks: []
                }
            ]
        },
        "BEAR": {
            currentFlow: 0,
            flows: [
                {
                    id: '20001',
                    blocks: []
                },
                {
                    id: '20002',
                    blocks: []
                },
                {
                    id: '20003',
                    blocks: []
                },
                {
                    id: '20004',
                    blocks: []
                }
            ]
        }
    },
    currentSprite: "CAT",
};

const spriteStateSlice = createSlice({
    name: 'spriteStateSlice',
    initialState: initialState,
    reducers: {
        setCurrentFlow(state, action) {
            state.sprites[action.payload.spriteName].currentFlow = action.payload.flowIndex;
        },
        setCurrentSprite(state, action) {
            state.currentSprite = action.payload;
        },
        updateBlocksOfFlow(state, action) {
            const { flows } = state.sprites[action.payload.spriteName];
            const flowsUpdated = flows.map((flow, index) => {
                if (index === action.payload.flowIndex) {
                    return { ...flow, ...action.payload.flowData, }
                }
                return { ...flow }
            })
            state.sprites[action.payload.spriteName].flows = flowsUpdated;
            return state;
        },
    },
});

export const {
    updateBlocksOfFlow,
    setCurrentFlow,
    setCurrentSprite,
} = spriteStateSlice.actions;

export const spriteStateReducer = spriteStateSlice.reducer;
