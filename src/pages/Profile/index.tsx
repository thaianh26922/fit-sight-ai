import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Table, message } from 'antd'
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
import axios from 'axios'
import PageHeader from '../../widgets/LazyLoading/PageHeader'
import { DatePicker } from 'antd'

const { RangePicker } = DatePicker
import Cookies from "js-cookie";

const COLORS = ['#FF6384', '#34c759', '#36A2EB']

const Profile: React.FC = () => {
  const [radarData, setRadarData] = useState([])
  const [pieData, setPieData] = useState([])
  const [workoutSchedule, setWorkoutSchedule] = useState([])
  const [dietSchedule, setDietSchedule] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('accessToken');
      try {
        const res = await axios.get('https://7b45-58-187-228-118.ngrok-free.app/fitness/history', {
          headers: {
            'Content-Type': 'text/plain',
            Authorization:
              `Bearer ${token}`,
          },
        })

        const data = res.data
        const stats = data.bodyStats[0]
        const comp = data.bodyComposition[0]

        setRadarData([
          { subject: 'Sức mạnh', A: stats.strength * 15, fullMark: 150 },
          { subject: 'Bền bỉ', A: stats.endurance * 15, fullMark: 150 },
          { subject: 'Dẻo dai', A: stats.flexibility * 15, fullMark: 150 },
          { subject: 'Trao đổi chất', A: stats.metabolism * 15, fullMark: 150 },
          { subject: 'Tư thế', A: stats.posture * 15, fullMark: 150 },
        ])

        setPieData([
          { name: 'Mỡ cơ thể', value: comp.fat },
          { name: 'Cơ bắp', value: comp.muscle },
          { name: 'Nước', value: comp.water },
        ])

        setWorkoutSchedule(
          data.workoutSchedule.map((item: any, i: number) => ({
            key: i,
            day: item.day,
            activity: item.activity,
          }))
        )

        setDietSchedule(
          data.mealPlan.map((item: any, i: number) => ({
            key: i,
            day: item.day,
            meals: `Ăn sáng: ${item.breakfast}\nTrưa: ${item.lunch}\nTối: ${item.dinner}`,
          }))
        )
      } catch (err) {
        message.error('Không thể tải dữ liệu từ máy chủ')
      }
    }

    fetchData()
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <PageHeader
            title="Thống kê cơ thể"
            extra={
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={{ flex: 1 }} md={{ flex: 0.4 }}>
                  <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
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
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
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

        <Col xs={24} md={12}>
          <Card title="Lịch tập luyện">
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
          <Card title="Lịch ăn uống">
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
