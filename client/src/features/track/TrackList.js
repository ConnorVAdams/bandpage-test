import TrackCard from './TrackCard'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'


const TrackList = () => {
    const artist = useSelector(state => state.artist.current)
    const user = useSelector(state => state.user.data)
    
    return (
        <div>
            {artist.tracks && artist.tracks.map(track => track && (
                <TrackCard key={track.id} track={track} />
            ))}
            {artist.id === user.artist.id ?
            <button>Add a New Track</button>
            :
            null}
        </div>
    )
}

export default TrackList