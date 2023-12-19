import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";
import { checkToken, getToken } from "../../utils/main";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../user/userSlice";
export const createSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})


const initialState = {
    data: null,
    // errors: [],
    // admin: false,
    current: null,
    // loading: true
}

const fetchAll = async (asyncThunk) => {
    try {
        const resp = await fetch('/artists')
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
        const resp = await fetch(`/artists/${artist_id}`)
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

const postArtist = async (values, asyncThunk) => {
    try {
        const respCheckToken = await checkToken()
        if (respCheckToken.ok) {
            const resp = await fetch('/artists', {
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
            const data = await respCheckToken.json()
            throw data.message || data.msg
        }
    } catch (error) {
        return error
    }
}

const patchArtist = async ({user, values}, asyncThunk) => {
    try {
        const respCheckToken = await checkToken()
        
        if (respCheckToken.ok) {
            const resp = await fetch(`/artists/${user.id}`, {
                method: "PATCH",
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
            const data = await respCheckToken.json()
            
            throw data.message || data.msg
        }
    } catch (error) {
        return error
    }
}

const artistSlice = createSlice({
    name: 'artist',
    initialState,
    reducers: (create) => ({
        setArtist: create.reducer((state, action) => {
            state.current = action.payload
            state.loading = false
            state.errors = []
        }),
        fetchAllArtists: create.asyncThunk(
            fetchAll,
            {
                pending: (state) => {
                    state.loading = true
                    state.errors = []
                },
                rejected: (state, action) => {
                    state.loading = false
                    state.errors.push(action.payload)
                },
                fulfilled: (state, action) => {
                    state.loading = false
                    state.data = action.payload
                },
            }
        ),
        fetchOneArtist: create.asyncThunk(
            fetchOne,
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
                        state.current = action.payload
                    }
                },
            }
        ),
        fetchPostArtist: create.asyncThunk(
            postArtist,
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
                    } 
                    // else {
                    //     state.data.push(action.payload)
                    // }
                },
            }
        ),
        fetchPatchArtist: create.asyncThunk(
            patchArtist,
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
                        
                    }
                },
            }
        ),
    }),
    selectors: {
        selectArtists(state){
            return state.data
        },
        selectArtistById: (state, artist_id) => {
            return state.data.find(artist => artist.id === artist_id)
        }
    }
})

export const {
    setArtist,
    fetchAllArtists, 
    fetchOneArtist,
    fetchNewArtist,
    fetchPostArtist, 
    fetchPatchArtist, 
} = artistSlice.actions
export const { selectArtists, selectErrors } = artistSlice.selectors
export default artistSlice.reducer