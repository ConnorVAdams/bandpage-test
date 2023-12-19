import React, {useState} from 'react'
import styled from "styled-components";
import { useFormik } from 'formik'
import * as yup from "yup"
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchRegister } from './userSlice'
import { setToken, setRefreshToken } from '../../utils/main';
import toast from 'react-hot-toast';
import { Form, Button, Col, Container, Row } from 'react-bootstrap'

function Authentication() {

    const [signUp, setSignUp] = useState(false)
    const dispatch = useDispatch() 
    const navigate = useNavigate()

    // TODO Yup schema
    
    const url = signUp ? "/signup" : "/login"

    const formik = useFormik({
        initialValues: {
            username:'',
            password:'',
            userType:'',
        },
        // validationSchema: signUp ? signupSchema : loginSchema,
        onSubmit: async (values, event) => {
            const action = await dispatch(fetchRegister({url, values}))
            if (typeof action.payload !== "string") {
                toast.success(`Welcome ${action.payload.user.username}!`)
                setToken(action.payload.jwt_token)
                setRefreshToken(action.payload.refresh_token)
                if (signUp) {
                    navigate(`${values.userType}s/new`)
                } else {
                    navigate('/landing')
                }

            } else {
                toast.error(action.payload)
            }
        }
    })
    
    const handleClick = () => {
        setSignUp((signUp) => !signUp)
    }

    const handleUserTypeChange = (e) => {
        // setUserTypeVal(e.target.value)
        formik.handleChange(e)
    }

    return (
        <Container>
            <Row className="justify-content-center mt-5">
            <Col md={6}>
                <div id="register-switch" className="text-center">
                <h2>Please Log in or Sign up!</h2>
                <h3>{signUp ? 'Already a member?' : 'Not a member?'}</h3>
                <Button variant="link" onClick={handleClick}>
                    {signUp ? 'Log In!' : 'Register now!'}
                </Button>
                </div>
                <Form onSubmit={formik.handleSubmit}>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                    type="text"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />
                    {formik.errors.username && formik.touched.username ? (
                    <div className="error-message show">{formik.errors.username}</div>
                    ) : null}
                </Form.Group>
    
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />
                    {formik.errors.password && formik.touched.password ? (
                    <div className="error-message show">{formik.errors.password}</div>
                    ) : null}
                </Form.Group>
    
                {signUp && (
                    <>
                    <Form.Group controlId="userType">
                        <Form.Label>User Type:</Form.Label>
                        <Form.Control
                        as="select"
                        name="userType"
                        value={formik.values.userType}
                        onChange={handleUserTypeChange}
                        onBlur={formik.handleBlur}
                        >
                        <option value="">Select</option>
                        <option value="artist">Artist</option>
                        <option value="fan">Fan</option>
                        </Form.Control>
                        {formik.errors.userType && formik.touched.userType ? (
                        <div className="error-message show">{formik.errors.userType}</div>
                        ) : null}
                    </Form.Group>
                    <Button type="submit" variant="primary">
                        Register
                    </Button>
                    </>
                )}
    
                {!signUp && (
                    <Button type="submit" variant="primary">
                    Log In!
                    </Button>
                )}
                </Form>
            </Col>
            </Row>
        </Container>
    )
}

export default Authentication