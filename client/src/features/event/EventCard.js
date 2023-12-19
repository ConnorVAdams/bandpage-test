import { Link } from 'react-router-dom'
import { formatDateTime } from '../../utils/helpers'
import { Card, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { fetchPostLike, fetchDeleteLike } from '../like/likeSlice'
import { fetchCurrentUser } from '../user/userSlice'

const EventCard = ({ event }) => {
    const {id, date_time, venue, artist_name, artist_id } = event
    const datetime = formatDateTime(date_time)
    
    const [ likeValues, setLikeValues ] = useState(
        {
            likeable_type: 'event',
            likeable_id: null,
            liker_type: null,
            artist_id: null,
            fan_id: null,
        }
    )
    

    const dispatch = useDispatch()

    const acct = useSelector(state => state.user.data)
    const user = useSelector(state => state.user.data.artist || state.user.data.fan)

    const admin = user.id === event.artist_id

    const inUserEvents = user.events_attending.some(event => event.id === id);

    useEffect(() => {
        if (event && user) {
            const newValues = {
                likeable_type: 'event',
                likeable_id: id,
                liker_type: !user.artist ? 'artist' : 'fan',
                // artist_id: acct.artist || acct.artist.id,
                // fan_id: acct.fan || acct.fan.id,
                ...(user
                    ? { 
                        artist_id: user.id,
                        fan_id: null
                        }
                    : {                         
                        artist_id: null ,
                        fan_id: user.id
                    }),
                };
            setLikeValues(newValues)
        }
    }, [])

    const handleClick = async () => {
        if (inUserEvents) {
            const event = user.events_attending.find(event => event.id === id)
            const like_id = event.likes.find(like => acct.artist ? like.artist_id : like.fan_id).id
            const resp = await dispatch(fetchDeleteLike(like_id));
            
            if (resp) {

                dispatch(fetchCurrentUser())
            }
        } else {
            const resp = await dispatch(fetchPostLike(likeValues));
            if (resp.payload === 201) {
                dispatch(fetchCurrentUser())
            }
        }
    };

    return (
        <Card id={id} className="mb-3">
            <Card.Body>
            <Link to={`/artists/${artist_id}`}>
            <Card.Subtitle as={Link} to={`/artists/${artist_id}`}>{artist_name}</Card.Subtitle>
            </Link>
            <Card.Text>{venue}</Card.Text>
            <Card.Text>Date: {datetime.date}</Card.Text>
            <Card.Text>Time: {datetime.time}</Card.Text>
            <Button
                variant={inUserEvents ? 'success' : 'danger'}
                onClick={handleClick}
                className="mr-2"
                >
                Attending {inUserEvents ? <FaCheck /> : <FaTimes />}
            </Button>
            </Card.Body>
        </Card>
        )
    }
    
    export default EventCard