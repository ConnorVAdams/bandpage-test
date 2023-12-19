import { useParams, useNavigate, useLocation, Link, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOneArtist } from './artistSlice'
import { convertDateFormat } from '../../utils/helpers'
// import { setEditMode, fetchOneProduction, fetchDeleteProduction } from './productionSlice'
// import styled from 'styled-components'
import NotFound from '../../components/NotFound'
import { toast } from 'react-hot-toast';
import TrackCard from '../track/TrackCard'
import EventCard from '../event/EventCard'
import ArtistCard from './ArtistCard'
import FanCard from '../fan/FanCard'
import { Button, Container, Nav, Navbar, Image, Row, Col, Text } from 'react-bootstrap'
import { FaCalendar, FaMapMarker, FaMusic } from 'react-icons/fa';


const ArtistWrapper = () => {
    const artist = useSelector(state => state.artist.current)
    const user = useSelector(state => state.user.data)
    const admin = useSelector(state => state.user.admin)
    const loc = useLocation()

    const { artist_id } = useParams()
    const { pathname } = loc
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(()=>{
        (async () => {
        if (!artist) {
            const {payload} = await dispatch(fetchOneArtist(artist_id || user.artist.id))
            if (typeof payload !== "string") {
            } else {
            toast.error(payload)
            navigate("/")
            }
        }
        })()
    },[artist, artist_id])

    if (!artist) {
        return <NotFound />
    }

    // const handleEdit = () => {
    //     dispatch(setEditMode(true))
    //     history.push(`/productions/edit/${production.id}`)
    // }

    const { id, name, location, img, genres, followed_artists, artist_followers, fan_followers } = artist 
    
    return (
        <>
            <ArtistCard 
                key={id}
                artist={artist}/>
                <Outlet />
        </>
        )
    }
    
    export default ArtistWrapper