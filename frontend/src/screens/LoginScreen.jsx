import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { io } from "socket.io-client";

let socket;

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));

      socket = io("https://gamitar.onrender.com");
      socket.emit("userLoggedIn", { userId: res._id });

      navigate("/home");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="login-screen-container">
      <FormContainer className="login-form-container">
        <h1 className="login-header">Sign In</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="login-form-group" controlId="email">
            <Form.Label className="login-form-label">Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-form-input"
            ></Form.Control>
          </Form.Group>

          <Form.Group className="login-form-group" controlId="password">
            <Form.Label className="login-form-label">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-form-input"
            ></Form.Control>
          </Form.Group>

          {isLoading && <Loader />}

          <Button type="submit" className="login-submit-button">
            Sign In
          </Button>

          <Row className="py-3">
            <Col>
              New Customer?{" "}
              <Link to="/register" className="login-link-text">
                Register
              </Link>
            </Col>
          </Row>
        </Form>
      </FormContainer>
    </div>
  );
};

export default LoginScreen;
