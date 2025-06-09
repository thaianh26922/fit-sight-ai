import React, { useState } from 'react'
import { Row, Col, Form, Input, Button, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import logo from '../../../assets/images/logo.png'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const { Text } = Typography

type LoginFormValues = {
  email: string
  password: string
}

type LoginResponse = {
  accessToken: string
}

const Login: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values: LoginFormValues) => {
    const { email, password } = values
    setLoading(true)

    try {
      const response = await axios.post<LoginResponse>(
        'https://7b45-58-187-228-118.ngrok-free.app/auth/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const { accessToken } = response.data
      if (accessToken) {
        Cookies.set('accessToken', accessToken, { expires: 7 })
        toast.success('Đăng nhập thành công!')
        navigate('/')
      } else {
        toast.error('Không nhận được accessToken từ máy chủ.')
      }
    } catch (error) {
      const err = error as AxiosError
      if (err.response?.status === 401) {
        toast.error('Sai tài khoản hoặc mật khẩu.')
      } else {
        toast.error('Đã xảy ra lỗi khi đăng nhập.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Row
        style={{
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#f5f5f5',
        }}
      >
        <Col
          xs={24}
          sm={18}
          md={12}
          lg={8}
          style={{
            background: '#fff',
            padding: '40px',
            borderRadius: 8,
          }}
        >
          <Row justify="center" style={{ marginBottom: 32 }}>
            <img src={logo} alt="Logo" width={200} />
          </Row>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark="optional"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input placeholder="Nhập địa chỉ email của bạn" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu của bạn" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  backgroundColor: '#34c759',
                  borderColor: '#34c759',
                }}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <Row justify="space-between" style={{ marginBottom: 16 }}>
              <Link to="/forgot-password" style={{ color: '#34c759' }}>
                Quên mật khẩu?
              </Link>
              <Link to="/register" style={{ color: '#34c759' }}>
                Đăng ký tài khoản
              </Link>
            </Row>
          </Form>

          <Row justify="center" style={{ marginTop: 24 }}>
            <Text
              type="secondary"
              style={{ fontSize: 12, textAlign: 'center' }}
            >
              Bằng cách đăng nhập, bạn đồng ý với{' '}
              <Link to="/terms" target="_blank" style={{ color: '#34c759' }}>
                Điều khoản dịch vụ
              </Link>{' '}
              và{' '}
              <Link to="/privacy" target="_blank" style={{ color: '#34c759' }}>
                Chính sách bảo mật
              </Link>
              .
            </Text>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default Login
