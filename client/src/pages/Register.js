import React, { useEffect } from 'react';
import { Button, Col, Form, Input, message, Row } from 'antd';
import '../resources/authentication.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '../constant/axios';
import logo from '../resources/PrintingLogo.png';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });
    axios
      .post(`${BASE_URL}/api/users/register`, values)
      .then((res) => {
        dispatch({ type: 'hideLoading' });
        message.success('Registrasi Berhasil');
      })
      .catch(() => {
        dispatch({ type: 'hideLoading' });
        message.error('Terjadi Kesalahan');
      });
  };
  useEffect(() => {
    if (localStorage.getItem('gajayana-pos-user')) navigate('/pemesanan');
  }, []);

  return (
    <div className='authentication'>
      <Row>
        <Col lg={8} xs={22}>
          <Form layout='vertical' onFinish={onFinish}>
            <img src={logo} height='70' width='360' alt='' />
            <hr />
            <h3>Register</h3>
            <Form.Item name='name' label='Nama'>
              <Input />
            </Form.Item>
            <Form.Item name='userId' label='User ID'>
              <Input />
            </Form.Item>
            <Form.Item name='password' label='Password'>
              <Input type='password' />
            </Form.Item>

            <div className='d-flex justify-content-between align-items-center'>
              <Link to='/login'>Already Registered ? Click Here To Login</Link>
              <Button htmlType='submit' type='primary'>
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
