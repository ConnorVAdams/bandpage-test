import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaEdit, FaSignOutAlt, FaSpotify, FaTrash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
// import { fetchOneArtist } from '../features/artist/artistSlice';
import { setUser, fetchDeleteUser, setSpotify } from '../features/user/userSlice';
import { convertDateFormat } from '../utils/helpers';
import { Button, Image } from 'react-bootstrap'
import { toast } from 'react-hot-toast'
import { fetchOneArtist } from '../features/artist/artistSlice'
import { setArtist } from '../features/artist/artistSlice';
import { setSpotifyToken, setToken } from '../utils/main';

const NavBar = () => {
    const acct = useSelector(state => state.user.data)
    const user = acct ? acct.artist || acct.fan : null
    const spotify = useSelector(state => state.user.spotify)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleMyPage = async () => {
        if (user) {
            try {
                const { payload } = await dispatch(fetchOneArtist(user.id))
                if (typeof payload !== "string") {
                    dispatch(setArtist(payload))
                    navigate(`artists/${user.id}`)
                } else {
                    toast.error(payload)
                }
            } catch (error) {
                console.error('Error fetching artist:', error);
            }
        }
    }

    const handleDelete = async () => {
        dispatch(fetchDeleteUser(acct.id))
    }
    
    const handleLogout = () => {
        localStorage.clear()
        setToken(null)
        dispatch(setArtist(null))
        dispatch(setUser(null))
        setSpotifyToken(null)
        dispatch(setSpotify(false))
    }

    return (
        <Navbar bg="light" expand="lg" id='main-nav' style={{ flexDirection: 'column'}}>
            <Navbar.Brand>
                <img
                src={process.env.PUBLIC_URL + '/assets/logo.png'}
                alt="Logo"
                width="30"
                height="30"
                className="d-inline-block align-top "
                style={{ borderRadius: '50%' }}
                /> BandPage
            </Navbar.Brand>
            <Container id='user-nav'>
            {user ? 
            <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav ">
            <Nav className="me-auto">
                    <NavDropdown title={<Image roundedCircle src={user.img} alt="User" style={{ width: '100px', height: '100px' }} className="user-image" />}>
                    <NavDropdown.Item>
                        {acct.username}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to={acct.artist ? `/artists/edit/${user.id}` : `/fans/edit/${user.id}`}>
                        <FaEdit/> Edit Profile
                        </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/authorize">
                        <FaSpotify/> Link Spotify Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={handleDelete}>
                        <FaTrash/> Delete Account
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                        <FaSignOutAlt/> Log Out
                    </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link  as={Link} to="/landing">Home</Nav.Link>
                    {user.genres ? <Nav.Link onClick={handleMyPage}>My Page</Nav.Link> : null}
                    {spotify ?
                    <Nav.Link  as={Link} to="/spotify_prof">My Spotify Profile</Nav.Link> : 
                    null }
                    <Button style={{height: '50%', margin: 'auto'}} as={Link} to="/artists">Explore Artists</Button>
            </Nav>
            </Navbar.Collapse>
            </>
            :
            null}
            </Container>
    </Navbar>
    );

    }

export default NavBar;