import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sprites: {
    "CAT": {
      costumes: ['/icons/CatSprite.svg', '/icons/CatSprite-2.svg'],
    },
    "BEAR": {
      costumes: ['/icons/bear-1.svg', '/icons/bear-2.svg'],
    },
  }
};

const featureDataStateSlice = createSlice({
  name: 'featureDataStateSlice',
  initialState: initialState,
  reducers: {
  },
});


export const featureDataStateReducer = featureDataStateSlice.reducer;
