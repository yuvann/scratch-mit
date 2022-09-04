import { configureStore } from '@reduxjs/toolkit'
import {useDispatch} from "react-redux";
import {spriteStateReducer} from "./spriteState";
import {featureDataStateReducer} from "./featureDataState";
import {canvasStateReducer} from "./canvasState";

const store = configureStore({
    reducer: {
        spritesData: spriteStateReducer,
        featureData: featureDataStateReducer,
        canvasData: canvasStateReducer,
    },
})

export const useAppDispatch = useDispatch;

export default store;