import React from 'react'
import { Row, Col, Card, Table } from 'antd'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import 'react-image-gallery/styles/css/image-gallery.css'
import BodyModel from '../../components/BodyModel'
import PageHeader from '../../widgets/LazyLoading/PageHeader'

import { DatePicker } from 'antd';


const { RangePicker } = DatePicker;

// Dữ liệu biểu đồ Radar
const radarData = [
  { subject: 'Sức mạnh', A: 120, fullMark: 150 },
  { subject: 'Bền bỉ', A: 98, fullMark: 150 },
  { subject: 'Dẻo dai', A: 86, fullMark: 150 },
  { subject: 'Trao đổi chất', A: 99, fullMark: 150 },
  { subject: 'Tư thế', A: 85, fullMark: 150 },
]

// Dữ liệu biểu đồ Pie (mỡ, cơ, nước)
const pieData = [
  { name: 'Mỡ cơ thể', value: 25 },
  { name: 'Cơ bắp', value: 45 },
  { name: 'Nước', value: 30 },
]

const COLORS = ['#FF6384', '#34c759', '#36A2EB']

// Dữ liệu bảng
const days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu']

const workoutSchedule = days.map((day, i) => ({
  key: i,
  day,
  activity: 'Tập toàn thân 30 phút',
}))

const dietSchedule = days.map((day, i) => ({
  key: i,
  day,
  meals: 'Ăn sáng: Yến mạch\nTrưa: Ức gà + rau\nTối: Trứng + rau',
}))

const Profile: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <PageHeader
            title="Thống kê cơ thể"
            extra={
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={{ flex: 1 }} md={{ flex: 0.4 }}>
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                  />
                </Col>

              </Row>
            }
          />
        </Col>
        <Col xs={24} md={12}>
          <Card title="Radar chỉ số thể chất">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Chỉ số" dataKey="A" stroke="#34c759" fill="#34c759" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Tỉ lệ thành phần cơ thể">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Ảnh 3D cơ thể (Xem 360°)">
            <BodyModel />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Lịch tập luyện (5 ngày)">
            <Table
              dataSource={workoutSchedule}
              pagination={false}
              columns={[
                { title: 'Ngày', dataIndex: 'day', key: 'day' },
                { title: 'Hoạt động', dataIndex: 'activity', key: 'activity' },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Lịch ăn uống (5 ngày)">
            <Table
              dataSource={dietSchedule}
              pagination={false}
              columns={[
                { title: 'Ngày', dataIndex: 'day', key: 'day' },
                {
                  title: 'Bữa ăn',
                  dataIndex: 'meals',
                  key: 'meals',
                  render: (text) => <pre style={{ whiteSpace: 'pre-wrap' }}>{text}</pre>,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Profile
