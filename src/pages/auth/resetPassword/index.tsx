import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Button } from 'antd'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import logo from '../../../assets/images/logo.png'


type ResetPasswordForm = {
  password: string
  confirmPassword: string
}

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm<ResetPasswordForm>()
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      toast.error('Không tìm thấy token đặt lại mật khẩu.')
    }
  }, [token])

  const onFinish = async (values: ResetPasswordForm) => {
    

    const { password, confirmPassword } = values
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.')
      return
    }

    setLoading(true)
    try {
      await axios.post('https://ee33-58-187-228-107.ngrok-free.app/auth/reset-password', {
        token,
        newPassword: password,
      })

      toast.success('Đặt lại mật khẩu thành công!')
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      toast.error('Đặt lại mật khẩu thất bại.')
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
              name="password"
              label="Mật khẩu mới"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
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
                Đặt lại mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default ResetPassword
