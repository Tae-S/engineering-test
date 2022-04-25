import { createSlice } from '@reduxjs/toolkit'

export const rollSlice = createSlice({
    name: 'roll',
    initialState: {value: []},
    reducers: {
        update: (state:any, action) => {
            //update roll state
            // state.value.push(action.payload)
            state.value[action.payload._id-1] = action.payload.rollState
            // console.log('state value', state.value)
        },
        initial : (state : any,  action) => {
            // console.log('initial: ', action.payload)
            // state.value = []
            if(state.value.length === 0){
                for(let i=0; i<action.payload.len; i++) state.value.push({_id: i+1, rollState: action.payload.rollState})
            }
            // console.log('state value', state.value)
        }
    }
})

export const { update, initial } = rollSlice.actions 
export default rollSlice.reducer