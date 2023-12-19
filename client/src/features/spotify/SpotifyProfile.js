import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { Card, Container, Image, Button, Row, Col } from 'react-bootstrap'
import { getSpotifyRefreshToken, getSpotifyToken } from "../../utils/main";

const SpotifyProfile = () => {
    const [spotProf, setSpotProf ] = useState(null)

    useEffect(() => {
        fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${getSpotifyToken()}`
            }
        })
        .then(resp => resp.json())
        .then(data => setSpotProf(data))
    }, [])

    if (spotProf) {
        return (
            <Card 
            id={spotProf.id} 
            className="mb-3">
                <Card.Body>
                <Container>
                    <h2>{spotProf.id}</h2>
                    <h4> Email: {spotProf.email}</h4>
                    <h4>Country: {spotProf.country}</h4>
                    <h4>Followers: {spotProf.followers.total}</h4>
                </Container>
                <Button as={Link} to={`${spotProf.external_urls.spotify}`} target="_blank" rel="noopener noreferrer">My Spotify Webpage</Button>
                </Card.Body>
            </Card>
        );
    }
    };
    
    export default SpotifyProfile;