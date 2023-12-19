import React, { useRef } from 'react';
import Helmet from '../components/Helmet/Helmet';
import CommonSection from '../components/UI/common-section/CommonSection';
import { Container, Row, Col } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const Register = () => {
  const registerFirstNameRef = useRef();
  const registerLastNameRef = useRef();
  const registerEmailRef = useRef();
  const registerPasswordRef = useRef();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const firstName = registerFirstNameRef.current.value;
    const lastName = registerLastNameRef.current.value;
    const email = registerEmailRef.current.value;
    const password = registerPasswordRef.current.value;

    try {
      const response = await axios.post('http://localhost:5000/v1/customers/register', {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        confirmButtonText: 'OK',
      });

      setTimeout(() => {
        navigate('/front-store/login');
      }, 1500);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message || 'Failed to register',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Helmet title='Register'>
      <CommonSection title='Register' />
      <section>
        <Container>
          <Row>
            <Col lg='6' md='6' sm='12' className='m-auto text-center'>
              <form className='form mb-5' onSubmit={submitHandler}>
                <div className='form__group'>
                  <input
                    type='text'
                    placeholder='First Name'
                    name='first_name'
                    ref={registerFirstNameRef}
                  ></input>
                </div>
                <div className='form__group'>
                  <input
                    type='text'
                    name='last_name'
                    placeholder='Last Name'
                    ref={registerLastNameRef}
                  ></input>
                </div>
                <div className='form__group'>
                  <input
                    type='email'
                    placeholder='Email'
                    name='email'
                    ref={registerEmailRef}
                  ></input>
                </div>
                <div className='form__group'>
                  <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    ref={registerPasswordRef}
                  ></input>
                </div>
                <button type='submit' className='addToCart__btn'>
                  Sign up
                </button>
              </form>
              <Link to='/front-store/login'>Already have an account? Login</Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Register;
