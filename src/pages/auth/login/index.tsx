import React, { useState, useContext } from 'react'
import { Row, Col, Form, Input, Button, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import logo from '../../../assets/images/logo.png'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../../../context'

const { Text } = Typography

type LoginFormValues = {
  email: string
  password: string
}

const Login: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { userList, setCurrentUser } = useContext(AuthContext);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true)
    const { email, password } = values

    setTimeout(() => {
      if (!userList) {
        toast.error('Không thể tải danh sách người dùng.')
        setLoading(false)
        return
      }

      const matchedUser = userList.find(
        (user: any) => user.email === email && user.password === password
      )

      if (matchedUser) {
        Cookies.set('accessToken', matchedUser.email, { expires: 7 })
        setCurrentUser(matchedUser);
        toast.success('Đăng nhập thành công!')

        if (matchedUser.email === 'admin@gmail.com') {
          navigate('/manager')
        } else {
          navigate('/')
        }
      } else {
        toast.error('Sai tài khoản hoặc mật khẩu.')
      }

      setLoading(false)
    }, 500) // mô phỏng delay
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
