import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ name, email, password }).unwrap();
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="login-screen-container">
    <FormContainer className="login-form-container">
      <h1 className="login-header">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="login-form-group" controlId="name">
          <Form.Label className="login-form-label">Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="login-form-input"
          ></Form.Control>
        </Form.Group>

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

        <Form.Group className="login-form-group" controlId="confirmPassword">
          <Form.Label className="login-form-label">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="login-form-input"
          ></Form.Control>
        </Form.Group>

        {isLoading && <Loader />}

        <Button type="submit" variant="primary" className="login-submit-button">
          Sign Up
        </Button>

        <Row className="py-3">
          <Col>
            Already have an account? <Link to="/" className="login-link-text">Login</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
    </div>
  );
};

export default RegisterScreen;
