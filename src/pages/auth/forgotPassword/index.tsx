import React, { useState } from 'react'
import { Row, Col, Form, Input, Button, Typography } from 'antd'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { Link } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import logo from '../../../assets/images/logo.png'

const { Text } = Typography

type ForgotPasswordForm = {
  email: string
}

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm<ForgotPasswordForm>()
  const [loading, setLoading] = useState(false)
  const onFinish = async (values: ForgotPasswordForm) => {
    setLoading(true)
    try {
      await axios.post('https://ee33-58-187-228-107.ngrok-free.app/auth/forgot-password', {
        email: values.email,
      })

      toast.success('Email khôi phục mật khẩu đã được gửi!')
      form.resetFields()
    } catch {
      toast.error('Gửi email thất bại. Vui lòng kiểm tra lại.')
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
                Gửi yêu cầu khôi phục
              </Button>
            </Form.Item>

            <Row justify="center">
              <Link to="/login" style={{ color: '#34c759' }}>
                Quay lại đăng nhập
              </Link>
            </Row>
          </Form>

          <Row justify="center" style={{ marginTop: 24 }}>
            <Text
              type="secondary"
              style={{ fontSize: 12, textAlign: 'center' }}
            >
              Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.
            </Text>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default ForgotPassword
