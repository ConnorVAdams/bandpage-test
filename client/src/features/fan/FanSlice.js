import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";
import { checkToken, getToken } from "../../utils/main";
export const createSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})

const initialState = {
    data: null,
    // errors: [],
    // loading: true
}

const fetchAll = async (asyncThunk) => {
    try {
        const resp = await fetch('/fans')
        const data = await resp.json()
        if (resp.ok) {
            return data
        } else {
            throw data.message || data.msg
        }
    } catch (error) {
        return error
    }
}

const fetchOne = async (artist_id, asyncThunk) => {
    try {
        const resp = await fetch(`/fans/${artist_id}`)
        const data = await resp.json()
        if (resp.ok) {
            return data
        } else {
            throw data.message || data.msg
        }
    } catch (error) {
        return error
    }
}

const postFan = async (values, asyncThunk) => {
    try {
        const respCheckToken = await checkToken()
        if (respCheckToken.ok) {
            const resp = await fetch('/fans', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            const data = await resp.json()
            if (resp.ok) {
                return data
            } else {
                throw data.message || data.msg
            }
        } else {
            // const data = await respCheckToken.json()
            // throw data.message || data.msg
        }
    } catch (error) {
        return error
    }
}

const fanSlice = createSlice({
    name: 'fan',
    initialState,
    reducers: (create) => ({
        fetchPostFan: create.asyncThunk(
            postFan,
            {
                pending: (state) => {
                    state.errors = []
                    state.loading = true
                },
                rejected: (state, action) => {
                    state.loading = false
                    state.errors.push(action.payload)
                },
                fulfilled: (state, action) => {
                    state.loading = false
                    if (!action.payload.id) {
                        state.errors.push(action.payload)
                    } else {
                        state.data.push(action.payload)
                    }
                },
            }
        ),
    }),
    selectors: {
        selectFans(state){
            return state.data
        },
        selectFanById: (state, artist_id) => {
            return state.data.find(artist => artist.id === artist_id)
        }
    }
})

export const {
    fetchPostFan, 
} = fanSlice.actions
export const { selectFans, selectErrors } = fanSlice.selectors
export default fanSlice.reducer