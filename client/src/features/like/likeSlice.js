import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";
import { checkToken, getToken } from "../../utils/main";
import userSlice from "../user/userSlice";
export const createSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})

const initialState = {
    // errors: [],
    // loading: true
}
const postLike = async (values, asyncThunk) => {
    try {
        const respCheckToken = await checkToken();
        if (respCheckToken.ok) {
            const resp = await fetch('/likes', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });
            const data = await resp.json();
            if (resp.ok) {
                return data;
            } else {
                throw data.message || data.msg;
            }
        } else {
            const data = await respCheckToken.json();
            throw data.message || data.msg;
        }
    } catch (error) {
        return error;
    }
};

const deleteLike = async (id, asyncThunk) => {
    try {
    const respCheckToken = await checkToken();

    if (respCheckToken.ok) {
        const resp = await fetch(`/likes/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
        });
        if (resp.status === 204 ) { // 204 NO CONTENT
            // const data = await resp.json();
            // throw data.message || data.msg;
            return true
        }
    } else {
        const data = await respCheckToken.json();
        throw data.message || data.msg;
    }
    } catch (error) {
    return error;
    }
};

const likeSlice = createSlice({
    name: 'like',
    initialState,
    reducers: (create) => ({
        fetchPostLike: create.asyncThunk(
            postLike,
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
        fetchDeleteLike: create.asyncThunk(
            deleteLike,
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

                    if (typeof action.payload === "string") {
                        state.errors.push(action.payload)
                    } else {
                        state.data = null
                    }
                },
            }
        ),
    }),
});

export const { fetchDeleteLike, fetchPostLike } = likeSlice.actions;
export default userSlice.reducer