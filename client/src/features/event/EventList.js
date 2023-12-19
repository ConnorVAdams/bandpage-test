import EventCard from './EventCard'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'


const EventList = () => {
    const artist = useSelector(state => state.artist.current)
    const user = useSelector(state => state.user.data)
    // const loc = useLocation()
    // const { pathname } = loc

    

        return (
            <div>
                {artist.upcoming_events && artist.upcoming_events.map(event => event && (
                    <EventCard key={event.id} event={event} />
                ))}
                {artist.id === user.artist.id ?
                <button>Add a New Event</button>
                :
                null}
            </div>
        )
}

export default EventList