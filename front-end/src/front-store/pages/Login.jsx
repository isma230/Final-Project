import React, { useRef } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const email = loginEmailRef.current.value;
    const password = loginPasswordRef.current.value;

    try {
      const response = await axios.post(
        "http://localhost:5000/v1/customers/login",
        {
          email,
          password,
        }
      );
      // Retrieve user information from the response
      const { customer } = response.data;
      // Put user information in local storage
      localStorage.setItem("customer", JSON.stringify(customer));
      toast.success("Login successful!");
      // Redirect to a different page after successful login
      setTimeout(() => {
        navigate("/front-store/home"); // Update with your desired path
      }, 1500);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response.data.message || "Failed to log in",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Helmet title="Login">
      <Toaster />
      <CommonSection title="Login" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              <form className="form mb-5" onSubmit={submitHandler}>
                <div className="form__group">
                  <input
                    type="email"
                    placeholder="Email"
                    ref={loginEmailRef}
                  ></input>
                </div>
                <div className="form__group">
                  <input
                    type="password"
                    placeholder="Password"
                    ref={loginPasswordRef}
                  ></input>
                </div>
                <button type="submit" className="addToCart__btn">
                  Login
                </button>
              </form>
              <Link to="/front-store/register">
                First time here? Create an account
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;
