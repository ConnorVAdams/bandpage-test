import { useSelector } from 'react-redux'
import NotFound from '../../components/NotFound'
import TrackCard from '../track/TrackCard'
import EventCard from '../event/EventCard'
import { Container } from 'react-bootstrap';


const ArtistDetail = () => {
    const artist = useSelector(state => state.artist.current)
    

    if (artist) {
        const {id, bio, tracks, upcoming_events } = artist 
        
        const topTrack = tracks.reduce((maxTrack, currentTrack) => {
            return currentTrack.likes > maxTrack.likes ? currentTrack : maxTrack;
            }, tracks[0])
        
            const nextEvent = upcoming_events[0]

        return (
            <div id={id}>
            <Container>
                
                <Container>
                    <p>{bio}</p>
                </Container>
                <Container>
                    <h3>Top Track</h3>
                    {topTrack ?
                    <TrackCard 
                    key={topTrack.id} 
                    track={topTrack}/>
                    :
                    'No tracks liked yet!'}
                </Container>

                <Container>
                    <h3>Next Event</h3>
                    {nextEvent ?
                        <EventCard 
                        key={nextEvent.id} 
                        event={nextEvent} />
                        :
                        'No events scheduled yet!'}
                </Container>

            </Container>
            </div>

            )
        }
    }
    
    export default ArtistDetail