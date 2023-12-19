import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaPlayCircle } from 'react-icons/fa';
import { FaCheck, FaTimes, FaTrash, FaPencilAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react';
import { fetchPostLike, fetchDeleteLike } from '../like/likeSlice';
import { fetchCurrentUser } from '../user/userSlice';
import { Link } from 'react-router-dom';

const TrackCard = ({ track }) => {
    const { id, name, audio, artist_name, artist_id } = track
    const [ likeValues, setLikeValues ] = useState(
        {
            likeable_type: 'track',
            likeable_id: null,
            liker_type: null,
            artist_id: null,
            fan_id: null,
        }
    )
    
    const dispatch = useDispatch()

    const acct = useSelector(state => state.user.data)
    const user = useSelector(state => state.user.data.artist || state.user.data.fan)

    const admin = user.id === track.artist_id

    const inUserTracks = user.favorited_tracks.some(track => track.id === id);

    useEffect(() => {
        if (track && user) {
            const newValues = {
                likeable_type: 'track',
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
        if (inUserTracks) {
            const track = user.favorited_tracks.find(track => track.id === id)
            const like_id = track.likes.find(like => acct.artist ? like.artist_id : like.fan_id).id
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
            <Row className="justify-content-between">
            <Col xs="auto">
                <FaPlayCircle size={50} />
            </Col>
            <Col>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle as={Link} to={`/artists/${artist_id}`}>{artist_name}</Card.Subtitle>
            </Col>
            <Col className='ml-auto'>
            <Button
                variant={inUserTracks ? 'success' : 'danger'}
                onClick={handleClick}
                className="mr-2 mb-2"
                >
            {inUserTracks ? <FaCheck /> : <FaTimes />} {inUserTracks ? 'Liked' : 'Like'}
            </Button>
            {admin ? 
                <>
                <FaPencilAlt/> <FaTrash/>
                </> 
                : 
                null}
            </Col>
            </Row>
        </Card.Body>
        </Card>
    );
}

export default TrackCard