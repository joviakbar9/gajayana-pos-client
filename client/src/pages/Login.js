import React, { useEffect } from 'react';
import { Button, Col, Form, Input, message, Row } from 'antd';
import '../resources/authentication.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '../constant/axios';
import logo from '../resources/PrintingLogo.png';

function Login() {
  const dispatch = useDispatch();
  const naviate = useNavigate();
  
  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });
    axios
      .post(`${BASE_URL}/api/users/login`, values)
      .then((res) => {
        dispatch({ type: 'hideLoading' });
        message.success('Login Berhasil');
        localStorage.setItem('gajayana-pos-user', JSON.stringify(res.data));
        naviate('/daftarpemesanan');
      })
      .catch(() => {
        dispatch({ type: 'hideLoading' });
        message.error('Terjadi Kesalahan');
      });
  };

  useEffect(() => {
    if (localStorage.getItem('gajayana-pos-user')) naviate('/daftarpemesanan');
  }, []);

  return (
    <div className='authentication'>
      <Row>
        <Col lg={8} xs={22}>
          <Form layout='vertical' onFinish={onFinish}>
            <img src={logo} height='70' width='360' />
            <hr />
            <h3>Login</h3>

            <Form.Item name='userId' label='User ID'>
              <Input />
            </Form.Item>
            <Form.Item name='password' label='Password'>
              <Input type='password' />
            </Form.Item>

            <div className='d-flex-justify-content-between-align-items-right'>
              {/* <Link to='/register'>
                Not Yet Registered ? Click Here To Register
              </Link> */}
              <Button htmlType='submit' type='primary'>
                Login
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
