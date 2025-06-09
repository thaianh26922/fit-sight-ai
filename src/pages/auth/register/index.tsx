import React, { useState } from 'react'
import { Row, Col, Form, Input, Button, Typography, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import logo from '../../../assets/images/logo.png'

const { Text } = Typography

// Kiểu dữ liệu cho form đăng ký
type RegisterFormValues = {
  email: string
  password: string
  confirmPassword: string
}

// Kiểu phản hồi từ API (nếu cần dùng chi tiết hơn)
type RegisterResponse = {
  message?: string
}

const Register: React.FC = () => {
  const [form] = Form.useForm<RegisterFormValues>()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values: RegisterFormValues) => {
    const { email, password } = values
    setLoading(true)

    try {
      await axios.post<RegisterResponse>(
        'https://7b45-58-187-228-118.ngrok-free.app/auth/register',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      message.success('Đăng ký thành công!')
      form.resetFields()
      navigate('/login')
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>
      if (err.response?.data?.message) {
        message.error(err.response.data.message)
      } else {
        message.error('Lỗi kết nối đến máy chủ')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row
      style={{
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#f5f5f5',
      }}
    >
      <Col xs={24} sm={18} md={12} lg={8} style={{ background: '#fff', padding: '40px', borderRadius: 8 }}>
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
            hasFeedback
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ backgroundColor: '#34c759', borderColor: '#34c759' }}
            >
              Đăng ký
            </Button>
          </Form.Item>

          <Row justify="center">
            <Text>
              Bạn đã có tài khoản?{' '}
              <Link to="/login" style={{ color: '#34c759' }}>
                Đăng nhập
              </Link>
            </Text>
          </Row>
        </Form>

        <Row justify="center" style={{ marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
            Bằng cách đăng ký, bạn đồng ý với{' '}
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
  )
}

export default Register
