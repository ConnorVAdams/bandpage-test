export const getToken = () => localStorage.getItem("jwt_token")
export const getRefreshToken = () => localStorage.getItem("refresh_token")
export const setToken = (token) => {
    if (token) {
        localStorage.setItem("jwt_token", token);
        } else {
        localStorage.removeItem("jwt_token");
        }
    };
export const setRefreshToken = (token) => localStorage.setItem("refresh_token", token)
export const checkToken = async () => {
    try {    
        const resp = await fetch("/check", {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        })
        if (!resp.ok) {
            const followResp = await postRefreshToken()
            if (followResp.ok) {
                const { jwt_token } = await followResp.json()
                setToken(jwt_token)
                return followResp
            } else {
                
                const { msg, message } = await followResp.json()
                throw Error(msg || message)
            }
        } else {
            return resp
        }
    } catch (error) {
        
        return error
    }
}
export const postRefreshToken = async () => {
    const resp = await fetch("/refresh", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${getRefreshToken()}`
        }
    })
    return resp 
}

// * SPOTIFY *

export const getSpotifyToken = () => localStorage.getItem('spotify_access_token')
export const getSpotifyRefreshToken = async () => {
    const refresh_token = localStorage.getItem('spotify_refresh_token')
    const url = "/get_spotify_token"

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "grant-type": "refresh_token",
            "refresh_token": `${refresh_token}`,
        })
        }
        
    

        const data = await fetch(url, payload)
        const response = await data.json()
        setSpotifyToken(response)
        // TODO Handle errors for bad response -> spotify === false
    }

export const getSpotifyExp = () => localStorage.getItem('spotify_exp')

export const setSpotifyToken = (token) => {
    if (token) {
        localStorage.setItem("spotify_access_token", token.access_token);
        localStorage.setItem("spotify_refresh_token", token.refresh_token);
        localStorage.setItem("spotify_exp", token.expires_in);
        } else {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_refresh_token");
        localStorage.removeItem("spotify_exp");
        }
    };

export const setSpotifyRefreshToken = (token) => localStorage.setItem("refresh_token", token)
