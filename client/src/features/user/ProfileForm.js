import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
// import { ErrorMessage, Field, Formik, Form } from 'formik'
// import artistFormSchema from './artistFormSchema'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { fetchPostArtist, fetchPatchArtist } from '../artist/artistSlice'
import { setUser, setUserType } from './userSlice'
import { fetchPostFan } from '../fan/fanSlice'
import { useDispatch } from 'react-redux'

const ProfileForm = () => {
    const acct = useSelector(state => state.user.data)
    const user = acct.artist || acct.fan

    const path = useLocation().pathname

    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    let initialValues

    if (path.includes('edit')) {
        initialValues = {
            name: user.name,
            genres: user.genres,
            bio: user.bio,
            location: user.location,
            img: user.img,
            user_id: acct.user_id
        }
    } else {
        initialValues = {
            name: '',
            genres:'',
            bio:'',
            location: '',
            img:'',
            user_id: acct.id
        }
    }

    // TODO Yup schema

    const formik = useFormik({
        initialValues: initialValues
        ,
        // validationSchema: null,
        onSubmit: async (values, event) => {
            if (path.includes('edit')) {
                const action = await dispatch(fetchPatchArtist({user, values}))
                if (typeof action.payload !== "string") {
                    dispatch(setUser(null))
                } else {
                    toast.error(action.payload)
                }
            }

            else if (path.includes('artist')) {
                const action = await dispatch(fetchPostArtist(values))
                if (typeof action.payload !== "string") {
                    toast.success(`Loaded new artist!`)
                    dispatch(setUserType(action.payload))
                    navigate('/landing')
                } else {
                    toast.error(action.payload)
                }

            } else { // if (path.includes('fan'))
                const action = await dispatch(fetchPostFan(values))
                if (typeof action.payload !== "string") {
                    dispatch(setUserType(action.payload))
                    navigate('/landing')
                } else {
                    toast.error(action.payload)
                }
            }
        }
    })
    
    return (
        <Container>
            <h1>{path.includes('new') ? `NEW ${path.includes('artist') ? 'ARTIST' : 'FAN'}` : 'EDIT PROFILE'}</h1>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Form onSubmit={formik.handleSubmit}>

                            <Form.Group controlId="name">
                                <Form.Label>{path.includes('artist') ? 'Artist Name' : 'Name'}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.name && formik.touched.name && (
                                    <Form.Text className="text-danger">{formik.errors.name}</Form.Text>
                                )}
                            </Form.Group>

                            {path.includes('artist') && (
                            <>
                                <Form.Group controlId="genres">
                                    <Form.Label>Genres</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="genres"
                                        value={formik.values.genres}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.genres && formik.touched.genres && (
                                        <Form.Text className="text-danger">{formik.errors.genres}</Form.Text>
                                    )}
                                </Form.Group>
                            </>
                        )}

                        <Form.Group controlId="bio">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="bio"
                                value={formik.values.bio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.bio && formik.touched.bio && (
                                <Form.Text className="text-danger">{formik.errors.bio}</Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group controlId="location">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.location && formik.touched.location && (
                                <Form.Text className="text-danger">{formik.errors.location}</Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group controlId="img">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="text"
                                name="img"
                                value={formik.values.img}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.img && formik.touched.img && (
                                <Form.Text className="text-danger">{formik.errors.img}</Form.Text>
                            )}
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default ProfileForm