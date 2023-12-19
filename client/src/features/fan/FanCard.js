// import { Link } from 'react-router-dom'

function FanCard({ fan }) {
    const {id, name, bio, location, img } = fan
    return (
        <div id={id}>
            <div>
            {/* <Link to={`/fans/${id}`}>  */}
                <h2>{name}</h2>
                <img src={img} alt={name}/>
            {/* </Link> */}
                <p>{bio}</p>
                <p>{location}</p>
            </div>

        </div>
        )
    }
    
    export default FanCard