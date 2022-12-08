import { createSlice } from "@reduxjs/toolkit";
import {createRecipeThunk, findIntRecipeByIDThunk, deleteRecipeThunk} from "./int-recipe-thunks";


const initialState = {
    recipes: [],
    loading: false,
    int_recipe_details: {}
}

const intRecipeReducer = createSlice({
    name: 'int_recipe',
    initialState,
    extraReducers: {
        [createRecipeThunk.fulfilled]: (state, action) => {
            state.int_recipe_details = action.payload
        },
        [findIntRecipeByIDThunk.fulfilled]: (state, action) => {
            state.int_recipe_details = action.payload
        },
        [deleteRecipeThunk.fulfilled]: (state, action) => {
            state.int_recipe_details = action.payload
        },
    }
})

export default intRecipeReducer.reducer