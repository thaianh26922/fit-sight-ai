import React, { useState, useContext, useEffect } from 'react'
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
const users = [
  {
    "id": 1,
    "email": "nguyenthithanh@gmail.com",
    "name": "Nguyễn Thị Thanh",
    "password": "123",
    "createDate": "2025-06-03"
  },
  {
    "id": 2,
    "email": "tranvanlinh@fpt.com",
    "name": "Trần Văn Linh",
    "password": "123",
    "createDate": "2025-07-07"
  },
  {
    "id": 3,
    "email": "leminhtuan@gmail.com",
    "name": "Lê Minh Tuấn",
    "password": "123",
    "createDate": "2025-06-25"
  },
  {
    "id": 4,
    "email": "phamthihuong@fpt.com",
    "name": "Phạm Thị Hương",
    "password": "123",
    "createDate": "2025-06-18"
  },
  {
    "id": 5,
    "email": "hoangvantrung@gmail.com",
    "name": "Hoàng Văn Trung",
    "password": "123",
    "createDate": "2025-06-06"
  },
  {
    "id": 6,
    "email": "nguyenvanhieu@fpt.com",
    "name": "Nguyễn Văn Hiếu",
    "password": "123",
    "createDate": "2025-05-26"
  },
  {
    "id": 7,
    "email": "tranthithuy@gmail.com",
    "name": "Trần Thị Thủy",
    "password": "123",
    "createDate": "2025-07-13"
  },
  {
    "id": 8,
    "email": "levanduc@fpt.com",
    "name": "Lê Văn Đức",
    "password": "123",
    "createDate": "2025-07-05"
  },
  {
    "id": 9,
    "email": "phamthiphuong@gmail.com",
    "name": "Phạm Thị Phương",
    "password": "123",
    "createDate": "2025-06-21"
  },
  {
    "id": 10,
    "email": "hoangminhduc@fpt.com",
    "name": "Hoàng Minh Đức",
    "password": "123",
    "createDate": "2025-07-02"
  },
  {
    "id": 11,
    "email": "nguyenthaomy@gmail.com",
    "name": "Nguyễn Thảo My",
    "password": "123",
    "createDate": "2025-06-12"
  },
  {
    "id": 12,
    "email": "tranvandai@fpt.com",
    "name": "Trần Văn Đại",
    "password": "123",
    "createDate": "2025-06-08"
  },
  {
    "id": 13,
    "email": "lethikieu@gmail.com",
    "name": "Lê Thị Kiều",
    "password": "123",
    "createDate": "2025-07-06"
  },
  {
    "id": 14,
    "email": "phamvansang@fpt.com",
    "name": "Phạm Văn Sáng",
    "password": "123",
    "createDate": "2025-06-26"
  },
  {
    "id": 15,
    "email": "hoangthianh@gmail.com",
    "name": "Hoàng Thị Ánh",
    "password": "123",
    "createDate": "2025-05-27"
  },
  {
    "id": 16,
    "email": "nguyenvanduy@fpt.com",
    "name": "Nguyễn Văn Duy",
    "password": "123",
    "createDate": "2025-06-07"
  },
  {
    "id": 17,
    "email": "tranthihanh@gmail.com",
    "name": "Trần Thị Hạnh",
    "password": "123",
    "createDate": "2025-06-22"
  },
  {
    "id": 18,
    "email": "levanquoc@fpt.com",
    "name": "Lê Văn Quốc",
    "password": "123",
    "createDate": "2025-06-15"
  },
  {
    "id": 19,
    "email": "phamthimanh@gmail.com",
    "name": "Phạm Thị Mạnh",
    "password": "123",
    "createDate": "2025-07-04"
  },
  {
    "id": 20,
    "email": "hoangvantien@fpt.com",
    "name": "Hoàng Văn Tiến",
    "password": "123",
    "createDate": "2025-06-29"
  },
  {
    "id": 21,
    "email": "nguyenthihong@gmail.com",
    "name": "Nguyễn Thị Hồng",
    "password": "123",
    "createDate": "2025-07-07"
  },
  {
    "id": 22,
    "email": "tranvanthanh@fpt.com",
    "name": "Trần Văn Thạnh",
    "password": "123",
    "createDate": "2025-06-19"
  },
  {
    "id": 23,
    "email": "lethixuan@gmail.com",
    "name": "Lê Thị Xuân",
    "password": "123",
    "createDate": "2025-05-30"
  },
  {
    "id": 24,
    "email": "phamvanminh@fpt.com",
    "name": "Phạm Văn Minh",
    "password": "123",
    "createDate": "2025-07-12"
  },
  {
    "id": 25,
    "email": "hoangthithu@gmail.com",
    "name": "Hoàng Thị Thu",
    "password": "123",
    "createDate": "2025-06-03"
  },
  {
    "id": 26,
    "email": "nguyenvansang@fpt.com",
    "name": "Nguyễn Văn Sang",
    "password": "123",
    "createDate": "2025-06-26"
  },
  {
    "id": 27,
    "email": "tranthidieu@gmail.com",
    "name": "Trần Thị Diệu",
    "password": "123",
    "createDate": "2025-06-14"
  },
  {
    "id": 28,
    "email": "levanhiep@fpt.com",
    "name": "Lê Văn Hiệp",
    "password": "123",
    "createDate": "2025-07-10"
  },
  {
    "id": 29,
    "email": "phamthilinh@gmail.com",
    "name": "Phạm Thị Linh",
    "password": "123",
    "createDate": "2025-05-28"
  },
  {
    "id": 30,
    "email": "hoangvansy@fpt.com",
    "name": "Hoàng Văn Sỹ",
    "password": "123",
    "createDate": "2025-06-09"
  },
  {
    "id": 31,
    "email": "nguyenthithuonggiang@gmail.com",
    "name": "Nguyễn Thị Hương Giang",
    "password": "123",
    "createDate": "2025-06-25"
  },
  {
    "id": 32,
    "email": "tranvanphong@fpt.com",
    "name": "Trần Văn Phong",
    "password": "123",
    "createDate": "2025-06-02"
  },
  {
    "id": 33,
    "email": "lethithanhthao@gmail.com",
    "name": "Lê Thị Thanh Thảo",
    "password": "123",
    "createDate": "2025-06-11"
  },
  {
    "id": 34,
    "email": "phamvanhung@fpt.com",
    "name": "Phạm Văn Hùng",
    "password": "123",
    "createDate": "2025-06-29"
  },
  {
    "id": 35,
    "email": "hoangthibich@gmail.com",
    "name": "Hoàng Thị Bích",
    "password": "123",
    "createDate": "2025-07-01"
  },
  {
    "id": 36,
    "email": "nguyenvangthang@fpt.com",
    "name": "Nguyễn Văn Thắng",
    "password": "123",
    "createDate": "2025-06-06"
  },
  {
    "id": 37,
    "email": "tranthihuyen@gmail.com",
    "name": "Trần Thị Huyền",
    "password": "123",
    "createDate": "2025-06-21"
  },
  {
    "id": 38,
    "email": "levanhai@fpt.com",
    "name": "Lê Văn Hải",
    "password": "123",
    "createDate": "2025-07-08"
  },
  {
    "id": 39,
    "email": "phamthimai@gmail.com",
    "name": "Phạm Thị Mai",
    "password": "123",
    "createDate": "2025-06-16"
  },
  {
    "id": 40,
    "email": "hoangvandiep@fpt.com",
    "name": "Hoàng Văn Điệp",
    "password": "123",
    "createDate": "2025-06-12"
  },
  {
    "id": 41,
    "email": "nguyenthikhanh@gmail.com",
    "name": "Nguyễn Thị Khánh",
    "password": "123",
    "createDate": "2025-06-03"
  },
  {
    "id": 42,
    "email": "tranvantruong@fpt.com",
    "name": "Trần Văn Trường",
    "password": "123",
    "createDate": "2025-06-22"
  },
  {
    "id": 43,
    "email": "lethithuhao@gmail.com",
    "name": "Lê Thị Thu Hảo",
    "password": "123",
    "createDate": "2025-07-11"
  },
  {
    "id": 44,
    "email": "phamvanphuc@fpt.com",
    "name": "Phạm Văn Phúc",
    "password": "123",
    "createDate": "2025-06-26"
  },
  {
    "id": 45,
    "email": "hoangthithanhnga@gmail.com",
    "name": "Hoàng Thị Thanh Nga",
    "password": "123",
    "createDate": "2025-05-29"
  },
  {
    "id": 46,
    "email": "nguyenvankiet@fpt.com",
    "name": "Nguyễn Văn Kiệt",
    "password": "123",
    "createDate": "2025-06-04"
  },
  {
    "id": 47,
    "email": "tranthithuytrang@gmail.com",
    "name": "Trần Thị Thùy Trang",
    "password": "123",
    "createDate": "2025-06-03"
  },
  {
    "id": 48,
    "email": "lethihongsang@fpt.com",
    "name": "Lê Thị Hồng Sang",
    "password": "123",
    "createDate": "2025-06-29"
  },
  {
    "id": 49,
    "email": "phamvanlam@gmail.com",
    "name": "Phạm Văn Lâm",
    "password": "123",
    "createDate": "2025-07-11"
  },
  {
    "id": 50,
    "email": "hoangthihoa@fpt.com",
    "name": "Hoàng Thị Hoa",
    "password": "123",
    "createDate": "2025-06-18"
  },
  {
    "id": 51,
    "email": "nguyenvanvu@gmail.com",
    "name": "Nguyễn Văn Vũ",
    "password": "123",
    "createDate": "2025-06-20"
  },
  {
    "id": 52,
    "email": "tranthidiem@fpt.com",
    "name": "Trần Thị Diễm",
    "password": "123",
    "createDate": "2025-06-07"
  },
  {
    "id": 53,
    "email": "lethithuyduong@gmail.com",
    "name": "Lê Thị Thùy Dương",
    "password": "123",
    "createDate": "2025-07-06"
  },
  {
    "id": 54,
    "email": "phamvanthang@fpt.com",
    "name": "Phạm Văn Thắng",
    "password": "123",
    "createDate": "2025-06-25"
  },
  {
    "id": 55,
    "email": "hoangthitram@gmail.com",
    "name": "Hoàng Thị Trâm",
    "password": "123",
    "createDate": "2025-06-02"
  },
  {
    "id": 56,
    "email": "nguyenvanlong@fpt.com",
    "name": "Nguyễn Văn Long",
    "password": "123",
    "createDate": "2025-06-28"
  },
  {
    "id": 57,
    "email": "tranthihanhphuc@gmail.com",
    "name": "Trần Thị Hạnh Phúc",
    "password": "123",
    "createDate": "2025-06-06"
  },
  {
    "id": 58,
    "email": "lethiminhtam@fpt.com",
    "name": "Lê Thị Minh Tâm",
    "password": "123",
    "createDate": "2025-07-04"
  },
  {
    "id": 59,
    "email": "phamvandat@gmail.com",
    "name": "Phạm Văn Đạt",
    "password": "123",
    "createDate": "2025-06-20"
  },
  {
    "id": 60,
    "email": "hoangthikimngan@fpt.com",
    "name": "Hoàng Thị Kim Ngân",
    "password": "123",
    "createDate": "2025-06-11"
  },
  {
    "id": 61,
    "email": "nguyenthithuytien@gmail.com",
    "name": "Nguyễn Thị Thùy Tiên",
    "password": "123",
    "createDate": "2025-07-15"
  },
  {
    "id": 62,
    "email": "tranvantai@fpt.com",
    "name": "Trần Văn Tài",
    "password": "123",
    "createDate": "2025-06-27"
  },
  {
    "id": 63,
    "email": "lethimydung@gmail.com",
    "name": "Lê Thị Mỹ Dung",
    "password": "123",
    "createDate": "2025-06-10"
  },
  {
    "id": 64,
    "email": "phamvanhieu@fpt.com",
    "name": "Phạm Văn Hiếu",
    "password": "123",
    "createDate": "2025-07-07"
  },
  {
    "id": 65,
    "email": "hoangthithanhnga@gmail.com",
    "name": "Hoàng Thị Thanh Nga",
    "password": "123",
    "createDate": "2025-07-01"
  },
  {
    "id": 66,
    "email": "nguyenvancuong@fpt.com",
    "name": "Nguyễn Văn Cường",
    "password": "123",
    "createDate": "2025-05-25"
  },
  {
    "id": 67,
    "email": "tranthihongnhung@gmail.com",
    "name": "Trần Thị Hồng Nhung",
    "password": "123",
    "createDate": "2025-06-03"
  },
  {
    "id": 68,
    "email": "lethibichngoc@fpt.com",
    "name": "Lê Thị Bích Ngọc",
    "password": "123",
    "createDate": "2025-06-22"
  },
  {
    "id": 69,
    "email": "phamvandanh@gmail.com",
    "name": "Phạm Văn Danh",
    "password": "123",
    "createDate": "2025-06-14"
  },
  {
    "id": 70,
    "email": "hoangthikimtuyen@fpt.com",
    "name": "Hoàng Thị Kim Tuyến",
    "password": "123",
    "createDate": "2025-05-31"
  },
  {
    "id": 71,
    "email": "nguyenthithuylinh@gmail.com",
    "name": "Nguyễn Thị Thùy Linh",
    "password": "123",
    "createDate": "2025-06-18"
  },
  {
    "id": 72,
    "email": "tranvanthien@fpt.com",
    "name": "Trần Văn Thiện",
    "password": "123",
    "createDate": "2025-06-07"
  },
  {
    "id": 73,
    "email": "lethihongvan@gmail.com",
    "name": "Lê Thị Hồng Vân",
    "password": "123",
    "createDate": "2025-07-09"
  },
  {
    "id": 74,
    "email": "phamvanduy@fpt.com",
    "name": "Phạm Văn Duy",
    "password": "123",
    "createDate": "2025-05-26"
  },
  {
    "id": 75,
    "email": "hoangthithanhbinh@gmail.com",
    "name": "Hoàng Thị Thanh Bình",
    "password": "123",
    "createDate": "2025-06-25"
  },
  {
    "id": 76,
    "email": "nguyenvantrung@fpt.com",
    "name": "Nguyễn Văn Trung",
    "password": "123",
    "createDate": "2025-07-14"
  },
  {
    "id": 77,
    "email": "tranthikimtuyen@gmail.com",
    "name": "Trần Thị Kim Tuyến",
    "password": "123",
    "createDate": "2025-06-28"
  },
  {
    "id": 78,
    "email": "lethimylan@fpt.com",
    "name": "Lê Thị Mỹ Lan",
    "password": "123",
    "createDate": "2025-06-04"
  },
  {
    "id": 79,
    "email": "phamvanan@gmail.com",
    "name": "Phạm Văn An",
    "password": "123",
    "createDate": "2025-06-15"
  },
  {
    "id": 80,
    "email": "hoangthikhanhly@fpt.com",
    "name": "Hoàng Thị Khánh Ly",
    "password": "123",
    "createDate": "2025-07-06"
  },
  {
    "id": 81,
    "email": "nguyenthithuynga@gmail.com",
    "name": "Nguyễn Thị Thúy Nga",
    "password": "123",
    "createDate": "2025-06-13"
  },
  {
    "id": 82,
    "email": "tranvanphat@fpt.com",
    "name": "Trần Văn Phát",
    "password": "123",
    "createDate": "2025-06-23"
  },
  {
    "id": 83,
    "email": "lethihonganh@gmail.com",
    "name": "Lê Thị Hồng Anh",
    "password": "123",
    "createDate": "2025-07-05"
  },
  {
    "id": 84,
    "email": "phamvanhai@fpt.com",
    "name": "Phạm Văn Hải",
    "password": "123",
    "createDate": "2025-06-18"
  },
  {
    "id": 85,
    "email": "hoangthithuyquynh@gmail.com",
    "name": "Hoàng Thị Thùy Quỳnh",
    "password": "123",
    "createDate": "2025-06-16"
  },
  {
    "id": 86,
    "email": "nguyenvanduykhanh@fpt.com",
    "name": "Nguyễn Văn Duy Khánh",
    "password": "123",
    "createDate": "2025-07-04"
  },
  {
    "id": 87,
    "email": "tranthithanhnga@gmail.com",
    "name": "Trần Thị Thanh Nga",
    "password": "123",
    "createDate": "2025-06-27"
  },
  {
    "id": 88,
    "email": "lethihonggam@fpt.com",
    "name": "Lê Thị Hồng Gấm",
    "password": "123",
    "createDate": "2025-06-01"
  },
  {
    "id": 89,
    "email": "phamvanhien@gmail.com",
    "name": "Phạm Văn Hiền",
    "password": "123",
    "createDate": "2025-07-08"
  },
  {
    "id": 90,
    "email": "hoangthitramanh@fpt.com",
    "name": "Hoàng Thị Trâm Anh",
    "password": "123",
    "createDate": "2025-06-29"
  },
  {
    "id": 91,
    "email": "nguyenthithuhien@gmail.com",
    "name": "Nguyễn Thị Thu Hiền",
    "password": "123",
    "createDate": "2025-07-03"
  },
  {
    "id": 92,
    "email": "tranvanloc@fpt.com",
    "name": "Trần Văn Lộc",
    "password": "123",
    "createDate": "2025-06-10"
  },
  {
    "id": 93,
    "email": "lethithuytien@gmail.com",
    "name": "Lê Thị Thùy Tiên",
    "password": "123",
    "createDate": "2025-07-02"
  },
  {
    "id": 94,
    "email": "phamvanduyet@fpt.com",
    "name": "Phạm Văn Duyệt",
    "password": "123",
    "createDate": "2025-06-26"
  },
  {
    "id": 95,
    "email": "hoangthihongsuyet@gmail.com",
    "name": "Hoàng Thị Hồng Tuyết",
    "password": "123",
    "createDate": "2025-06-22"
  },
  {
    "id": 96,
    "email": "nguyenvanhieu@fpt.com",
    "name": "Nguyễn Văn Hiếu",
    "password": "123",
    "createDate": "2025-07-05"
  },
  {
    "id": 97,
    "email": "tranthithuyhang@gmail.com",
    "name": "Trần Thị Thùy Hằng",
    "password": "123",
    "createDate": "2025-05-25"
  },
  {
    "id": 98,
    "email": "lethimyanh@fpt.com",
    "name": "Lê Thị Mỹ Anh",
    "password": "123",
    "createDate": "2025-06-11"
  },
  {
    "id": 99,
    "email": "phamvanthien@gmail.com",
    "name": "Phạm Văn Thiện",
    "password": "123",
    "createDate": "2025-06-03"
  },
  {
    "id": 100,
    "email": "hoangthithuytrang@fpt.com",
    "name": "Hoàng Thị Thùy Trang",
    "password": "123",
    "createDate": "2025-06-25"
  },
  {
    "id": 101,
    "email": "nguyenthithuylinh@gmail.com",
    "name": "Nguyễn Thị Thùy Linh",
    "password": "123",
    "createDate": "2025-07-13"
  },
  {
    "id": 102,
    "email": "tranvandat@fpt.com",
    "name": "Trần Văn Đạt",
    "password": "123",
    "createDate": "2025-05-30"
  },
  {
    "id": 103,
    "email": "lethiminhthu@gmail.com",
    "name": "Lê Thị Minh Thư",
    "password": "123",
    "createDate": "2025-06-06"
  },
  {
    "id": 104,
    "email": "phamvanphu@fpt.com",
    "name": "Phạm Văn Phú",
    "password": "123",
    "createDate": "2025-06-12"
  },
  {
    "id": 105,
    "email": "hoangthikimhue@gmail.com",
    "name": "Hoàng Thị Kim Huệ",
    "password": "123",
    "createDate": "2025-06-23"
  },
  {
    "id": 106,
    "email": "nguyenvanbinh@fpt.com",
    "name": "Nguyễn Văn Bình",
    "password": "123",
    "createDate": "2025-07-10"
  },
  {
    "id": 107,
    "email": "tranthimailinh@gmail.com",
    "name": "Trần Thị Mai Linh",
    "password": "123",
    "createDate": "2025-06-01"
  },
  {
    "id": 108,
    "email": "lethihongyen@fpt.com",
    "name": "Lê Thị Hồng Yến",
    "password": "123",
    "createDate": "2025-06-27"
  },
  {
    "id": 109,
    "email": "phamvanquang@gmail.com",
    "name": "Phạm Văn Quang",
    "password": "123",
    "createDate": "2025-07-02"
  },
  {
    "id": 110,
    "email": "hoangthikimanh@fpt.com",
    "name": "Hoàng Thị Kim Anh",
    "password": "123",
    "createDate": "2025-05-28"
  },
  {
    "id": 111,
    "email": "nguyenthithuthao@gmail.com",
    "name": "Nguyễn Thị Thu Thảo",
    "password": "123",
    "createDate": "2025-07-07"
  },
  {
    "id": 112,
    "email": "tranvansy@fpt.com",
    "name": "Trần Văn Sỹ",
    "password": "123",
    "createDate": "2025-06-14"
  },
  {
    "id": 113,
    "email": "lethithuyloi@gmail.com",
    "name": "Lê Thị Thùy Lợi",
    "password": "123",
    "createDate": "2025-07-04"
  },
  {
    "id": 114,
    "email": "phamvantuan@fpt.com",
    "name": "Phạm Văn Tuấn",
    "password": "123",
    "createDate": "2025-06-08"
  },
  {
    "id": 115,
    "email": "hoangthihuyenchau@gmail.com",
    "name": "Hoàng Thị Huyền Châu",
    "password": "123",
    "createDate": "2025-06-15"
  },
  {
    "id": 116,
    "email": "nguyenvandoan@fpt.com",
    "name": "Nguyễn Văn Đoan",
    "password": "123",
    "createDate": "2025-06-21"
  },
  {
    "id": 117,
    "email": "tranthithuyngoc@gmail.com",
    "name": "Trần Thị Thùy Ngọc",
    "password": "123",
    "createDate": "2025-06-03"
  },
  {
    "id": 118,
    "email": "lethikimnguyet@fpt.com",
    "name": "Lê Thị Kim Nguyệt",
    "password": "123",
    "createDate": "2025-06-28"
  },
  {
    "id": 119,
    "email": "phamvanthinh@gmail.com",
    "name": "Phạm Văn Thịnh",
    "password": "123",
    "createDate": "2025-06-06"
  },
  {
    "id": 120,
    "email": "hoangthihanhtrang@fpt.com",
    "name": "Hoàng Thị Hạnh Trang",
    "password": "123",
    "createDate": "2025-07-01"
  },
  {
    "id": 121,
    "email": "nguyenthithanhnga@gmail.com",
    "name": "Nguyễn Thị Thanh Nga",
    "password": "123",
    "createDate": "2025-06-19"
  },
  {
    "id": 122,
    "email": "tranvanhau@fpt.com",
    "name": "Trần Văn Hậu",
    "password": "123",
    "createDate": "2025-06-13"
  },
  {
    "id": 123,
    "email": "lethithuykieu@gmail.com",
    "name": "Lê Thị Thùy Kiều",
    "password": "123",
    "createDate": "2025-07-05"
  },
  {
    "id": 124,
    "email": "phamvanloc@fpt.com",
    "name": "Phạm Văn Lộc",
    "password": "123",
    "createDate": "2025-06-08"
  },
  {
    "id": 125,
    "email": "hoangthithukhanh@gmail.com",
    "name": "Hoàng Thị Thu Khánh",
    "password": "123",
    "createDate": "2025-06-20"
  },
  {
    "id": 126,
    "email": "nguyenvanminhtam@fpt.com",
    "name": "Nguyễn Văn Minh Tâm",
    "password": "123",
    "createDate": "2025-06-23"
  },
  {
    "id": 127,
    "email": "tranthithanhtuyen@gmail.com",
    "name": "Trần Thị Thanh Tuyền",
    "password": "123",
    "createDate": "2025-06-18"
  },
  {
    "id": 128,
    "email": "lethihongnhung@fpt.com",
    "name": "Lê Thị Hồng Nhung",
    "password": "123",
    "createDate": "2025-06-01"
  },
  {
    "id": 129,
    "email": "phamvanhoang@gmail.com",
    "name": "Phạm Văn Hoàng",
    "password": "123",
    "createDate": "2025-06-25"
  },
  {
    "id": 130,
    "email": "hoangthithuytrang@fpt.com",
    "name": "Hoàng Thị Thùy Trang",
    "password": "123",
    "createDate": "2025-06-16"
  },
  {
    "id": 131,
    "email": "nguyenthithuyduong@gmail.com",
    "name": "Nguyễn Thị Thùy Dương",
    "password": "123",
    "createDate": "2025-06-24"
  },
  {
    "id": 132,
    "email": "tranvanthienphuc@fpt.com",
    "name": "Trần Văn Thiện Phúc",
    "password": "123",
    "createDate": "2025-07-08"
  },
  {
    "id": 133,
    "email": "lethimydien@gmail.com",
    "name": "Lê Thị Mỹ Duyên",
    "password": "123",
    "createDate": "2025-05-27"
  },
  {
    "id": 134,
    "email": "phamvantrong@fpt.com",
    "name": "Phạm Văn Trọng",
    "password": "123",
    "createDate": "2025-06-09"
  },
  {
    "id": 135,
    "email": "hoangthikimlien@gmail.com",
    "name": "Hoàng Thị Kim Liên",
    "password": "123",
    "createDate": "2025-06-03"
  },
  {
    "id": 136,
    "email": "nguyenvancuong@fpt.com",
    "name": "Nguyễn Văn Cường",
    "password": "123",
    "createDate": "2025-07-06"
  },
  {
    "id": 137,
    "email": "tranthithuyngoc@gmail.com",
    "name": "Trần Thị Thùy Ngọc",
    "password": "123",
    "createDate": "2025-06-11"
  },
  {
    "id": 138,
    "email": "lethithanhvan@fpt.com",
    "name": "Lê Thị Thanh Vân",
    "password": "123",
    "createDate": "2025-06-29"
  },
  {
    "id": 139,
    "email": "phamvanduong@gmail.com",
    "name": "Phạm Văn Dương",
    "password": "123",
    "createDate": "2025-07-13"
  },
  {
    "id": 140,
    "email": "hoangthithanhmai@fpt.com",
    "name": "Hoàng Thị Thanh Mai",
    "password": "123",
    "createDate": "2025-06-04"
  },
  {
    "id": 141,
    "email": "nguyenthithanhnhan@gmail.com",
    "name": "Nguyễn Thị Thanh Nhàn",
    "password": "123",
    "createDate": "2025-06-22"
  },
  {
    "id": 142,
    "email": "tranvandiem@fpt.com",
    "name": "Trần Văn Diệm",
    "password": "123",
    "createDate": "2025-06-14"
  },
  {
    "id": 143,
    "email": "lethithuyhien@gmail.com",
    "name": "Lê Thị Thùy Hiền",
    "password": "123",
    "createDate": "2025-07-10"
  },
  {
    "id": 144,
    "email": "phamvanhoa@fpt.com",
    "name": "Phạm Văn Hòa",
    "password": "123",
    "createDate": "2025-06-08"
  },
  {
    "id": 145,
    "email": "hoangthithuyanh@gmail.com",
    "name": "Hoàng Thị Thùy Anh",
    "password": "123",
    "createDate": "2025-06-25"
  },
  {
    "id": 146,
    "email": "nguyenvansang@fpt.com",
    "name": "Nguyễn Văn Sang",
    "password": "123",
    "createDate": "2025-06-02"
  },
  {
    "id": 147,
    "email": "tranthithuhong@gmail.com",
    "name": "Trần Thị Thu Hồng",
    "password": "123",
    "createDate": "2025-06-20"
  },
  {
    "id": 148,
    "email": "lethimydung@fpt.com",
    "name": "Lê Thị Mỹ Dung",
    "password": "123",
    "createDate": "2025-06-17"
  },
  {
    "id": 149,
    "email": "phamvanhieu@gmail.com",
    "name": "Phạm Văn Hiếu",
    "password": "123",
    "createDate": "2025-07-11"
  },
  {
    "id": 150,
    "email": "hoangthikimchi@fpt.com",
    "name": "Hoàng Thị Kim Chi",
    "password": "123",
    "createDate": "2025-06-05"
  },
  {
    "id": 151,
    "email": "nguyenthithuyvan@gmail.com",
    "name": "Nguyễn Thị Thùy Vân",
    "password": "123",
    "createDate": "2025-06-23"
  },
  {
    "id": 152,
    "email": "tranvanthanhliem@fpt.com",
    "name": "Trần Văn Thanh Liêm",
    "password": "123",
    "createDate": "2025-06-15"
  },
  {
    "id": 153,
    "email": "lethikimngoc@gmail.com",
    "name": "Lê Thị Kim Ngọc",
    "password": "123",
    "createDate": "2025-06-27"
  },
  {
    "id": 154,
    "email": "phamvankhanh@fpt.com",
    "name": "Phạm Văn Khánh",
    "password": "123",
    "createDate": "2025-07-06"
  },
  {
    "id": 155,
    "email": "hoangthibichlien@gmail.com",
    "name": "Hoàng Thị Bích Liên",
    "password": "123",
    "createDate": "2025-06-03"
  },
  {
    "id": 156,
    "email": "nguyenvantrungkien@fpt.com",
    "name": "Nguyễn Văn Trung Kiên",
    "password": "123",
    "createDate": "2025-07-10"
  },
  {
    "id": 157,
    "email": "tranthithuyhang@gmail.com",
    "name": "Trần Thị Thùy Hằng",
    "password": "123",
    "createDate": "2025-06-18"
  },
  {
    "id": 158,
    "email": "lethikimthanh@fpt.com",
    "name": "Lê Thị Kim Thanh",
    "password": "123",
    "createDate": "2025-06-04"
  },
  {
    "id": 159,
    "email": "phamvanduyet@gmail.com",
    "name": "Phạm Văn Duyệt",
    "password": "123",
    "createDate": "2025-06-25"
  },
  {
    "id": 160,
    "email": "hoangthithuyduong@fpt.com",
    "name": "Hoàng Thị Thùy Dương",
    "password": "123",
    "createDate": "2025-06-07"
  },
  {
    "id": 161,
    "email": "nguyenthithanhduyen@gmail.com",
    "name": "Nguyễn Thị Thanh Duyên",
    "password": "123",
    "createDate": "2025-07-09"
  },
  {
    "id": 162,
    "email": "tranvanduc@fpt.com",
    "name": "Trần Văn Đức",
    "password": "123",
    "createDate": "2025-06-20"
  },
  {
    "id": 163,
    "email": "lethikimloan@gmail.com",
    "name": "Lê Thị Kim Loan",
    "password": "123",
    "createDate": "2025-06-13"
  },
  {
    "id": 164,
    "email": "phamvankhang@fpt.com",
    "name": "Phạm Văn Khang",
    "password": "123",
    "createDate": "2025-07-02"
  },
  {
    "id": 165,
    "email": "hoangthimylinh@gmail.com",
    "name": "Hoàng Thị Mỹ Linh",
    "password": "123",
    "createDate": "2025-06-17"
  },
  {
    "id": 166,
    "email": "nguyenvankiet@fpt.com",
    "name": "Nguyễn Văn Kiệt",
    "password": "123",
    "createDate": "2025-06-25"
  },
  {
    "id": 167,
    "email": "tranthithuyduyen@gmail.com",
    "name": "Trần Thị Thùy Duyên",
    "password": "123",
    "createDate": "2025-05-29"
  },
  {
    "id": 168,
    "email": "lethihongngoc@fpt.com",
    "name": "Lê Thị Hồng Ngọc",
    "password": "123",
    "createDate": "2025-06-08"
  },
  {
    "id": 169,
    "email": "phamvantuananh@gmail.com",
    "name": "Phạm Văn Tuấn Anh",
    "password": "123",
    "createDate": "2025-07-01"
  },
  {
    "id": 170,
    "email": "hoangthikimngan@fpt.com",
    "name": "Hoàng Thị Kim Ngân",
    "password": "123",
    "createDate": "2025-06-12"
  },
  {
    "id": 171,
    "email": "nguyenthithuyhien@gmail.com",
    "name": "Nguyễn Thị Thùy Hiền",
    "password": "123",
    "createDate": "2025-07-04"
  },
  {
    "id": 172,
    "email": "tranvanduy@fpt.com",
    "name": "Trần Văn Duy",
    "password": "123",
    "createDate": "2025-06-21"
  },
  {
    "id": 173,
    "email": "lethithuytrang@gmail.com",
    "name": "Lê Thị Thùy Trang",
    "password": "123",
    "createDate": "2025-06-03"
  },
  {
    "id": 174,
    "email": "phamvanminhduc@fpt.com",
    "name": "Phạm Văn Minh Đức",
    "password": "123",
    "createDate": "2025-06-28"
  },
  {
    "id": 175,
    "email": "hoangthithanhthao@gmail.com",
    "name": "Hoàng Thị Thanh Thảo",
    "password": "123",
    "createDate": "2025-07-10"
  },
  {
    "id": 176,
    "email": "nguyenvantrungduy@fpt.com",
    "name": "Nguyễn Văn Trung Duy",
    "password": "123",
    "createDate": "2025-05-25"
  },
  {
    "id": 177,
    "email": "tranthithuylinh@gmail.com",
    "name": "Trần Thị Thùy Linh",
    "password": "123",
    "createDate": "2025-06-08"
  },
  {
    "id": 178,
    "email": "lethibichngan@fpt.com",
    "name": "Lê Thị Bích Ngân",
    "password": "123",
    "createDate": "2025-06-25"
  },
  {
    "id": 179,
    "email": "phamvankhoa@gmail.com",
    "name": "Phạm Văn Khoa",
    "password": "123",
    "createDate": "2025-06-11"
  },
  {
    "id": 180,
    "email": "hoangthikimhue@fpt.com",
    "name": "Hoàng Thị Kim Huệ",
    "password": "123",
    "createDate": "2025-07-06"
  },
  {
    "id": 181,
    "email": "nguyenthithanhmai@gmail.com",
    "name": "Nguyễn Thị Thanh Mai",
    "password": "123",
    "createDate": "2025-06-19"
  },
  {
    "id": 182,
    "email": "tranvanthien@fpt.com",
    "name": "Trần Văn Thiện",
    "password": "123",
    "createDate": "2025-07-14"
  },
  {
    "id": 183,
    "email": "lethimydien@gmail.com",
    "name": "Lê Thị Mỹ Duyên",
    "password": "123",
    "createDate": "2025-06-16"
  },
  {
    "id": 184,
    "email": "phamvanthanglong@fpt.com",
    "name": "Phạm Văn Thăng Long",
    "password": "123",
    "createDate": "2025-06-02"
  },
  {
    "id": 185,
    "email": "hoangthihongngoc@gmail.com",
    "name": "Hoàng Thị Hồng Ngọc",
    "password": "123",
    "createDate": "2025-06-28"
  },
  {
    "id": 186,
    "email": "nguyenvantrong@fpt.com",
    "name": "Nguyễn Văn Trọng",
    "password": "123",
    "createDate": "2025-06-06"
  },
  {
    "id": 187,
    "email": "tranthithuydiem@gmail.com",
    "name": "Trần Thị Thùy Diễm",
    "password": "123",
    "createDate": "2025-06-13"
  },
  {
    "id": 188,
    "email": "lethikimtuyen@fpt.com",
    "name": "Lê Thị Kim Tuyến",
    "password": "123",
    "createDate": "2025-07-15"
  },
  {
    "id": 189,
    "email": "phamvanvu@gmail.com",
    "name": "Phạm Văn Vũ",
    "password": "123",
    "createDate": "2025-06-22"
  },
  {
    "id": 190,
    "email": "hoangthithanhthuy@fpt.com",
    "name": "Hoàng Thị Thanh Thủy",
    "password": "123",
    "createDate": "2025-07-04"
  },
  {
    "id": 191,
    "email": "nguyenthithuynga@gmail.com",
    "name": "Nguyễn Thị Thúy Nga",
    "password": "123",
    "createDate": "2025-06-26"
  },
  {
    "id": 192,
    "email": "tranvanphuoc@fpt.com",
    "name": "Trần Văn Phước",
    "password": "123",
    "createDate": "2025-06-01"
  },
  {
    "id": 193,
    "email": "lethihongsang@gmail.com",
    "name": "Lê Thị Hồng Sang",
    "password": "123",
    "createDate": "2025-07-08"
  },
  {
    "id": 194,
    "email": "phamvanphatdat@fpt.com",
    "name": "Phạm Văn Phát Đạt",
    "password": "123",
    "createDate": "2025-06-17"
  },
  {
    "id": 195,
    "email": "hoangthibichthuy@gmail.com",
    "name": "Hoàng Thị Bích Thủy",
    "password": "123",
    "createDate": "2025-06-09"
  },
  {
    "id": 196,
    "email": "nguyenvankhac@fpt.com",
    "name": "Nguyễn Văn Khắc",
    "password": "123",
    "createDate": "2025-06-25"
  },
  {
    "id": 197,
    "email": "tranthithuyquy@gmail.com",
    "name": "Trần Thị Thùy Quyên",
    "password": "123",
    "createDate": "2025-06-20"
  },
  {
    "id": 198,
    "email": "lethikimluyen@fpt.com",
    "name": "Lê Thị Kim Luyến",
    "password": "123",
    "createDate": "2025-07-13"
  },
  {
    "id": 199,
    "email": "phamvantan@gmail.com",
    "name": "Phạm Văn Tân",
    "password": "123",
    "createDate": "2025-07-05"
  },
  {
    "id": 200,
    "email": "hoangthithuytrinh@fpt.com",
    "name": "Hoàng Thị Thùy Trinh",
    "password": "123",
    "createDate": "2025-06-29"
  },
  {
    "id": 201,
    "email": "admin@gmail.com",
    "name": "Trần Minh Đức",
    "password": "admin123",
    "createDate": "2025-06-29"
  }
]
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

  useEffect(() => {
    const existingUsers = localStorage.getItem('users')
    if (!existingUsers) {
      localStorage.setItem('users', JSON.stringify(users))
    }
  }, [])


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
