import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import {
  Avatar,
  Col,
  Layout,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useRef, useState } from 'react';
import FitSightSteps from '../../components/FitSightSteps';
import { AuthContext, type AnalysisData } from '../../context';
import SendMessageForm from './components/SendMessageForm';
// Import AuthContext và AnalysisData

const { Content } = Layout;
const { Text } = Typography;

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  images?: UploadFile[];
};

type HistoryResponse = {
  createdAt: string;
  role: 'user' | 'assistant';
  content: string;
};

// Dữ liệu mẫu (Giữ nguyên)
const analyzeData = [
  {
    "id": 1,
    "chi_so_co_the": {
      "suc_manh": 70,
      "suc_ben": 70,
      "tu_the": 80,
      "trao_doi_chat": 75,
      "do_deo_dai": 75
    },
    "thanh_phan_co_the": {
      "mo": "15%",
      "co": "40%",
      "nuoc": "60%"
    },
    "lich_tap_luyen": {
      "thu_hai": "Chạy bộ 5km",
      "thu_ba": "Tập ngực và tay sau",
      "thu_tu": "Đi bộ nhẹ nhàng",
      "thu_nam": "Tập lưng và tay trước",
      "thu_sau": "Tập chân",
      "thu_bay": "Yoga và giãn cơ",
      "chu_nhat": "Nghỉ ngơi"
    },
    "thuc_don_mau": {
      "thu_hai": {
        "sang": {
          "ten_mon": "Trứng ốp la và bánh mì nguyên cám",
          "calo_tren_100g": "150 kcal (trứng ốp la), 250 kcal (bánh mì nguyên cám)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.EqnJSN1Gihbr4LEvfi2fUgHaD4?w=301&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Cơm gạo lứt với ức gà",
          "calo_tren_100g": "130 kcal (gạo lứt), 165 kcal (ức gà)",
          "anh_mon_an": "https://i.ytimg.com/vi/m8V3ULygdoI/maxresdefault.jpg"
        },
        "toi": {
          "ten_mon": "Cá hồi nướng và salad",
          "calo_tren_100g": "208 kcal (cá hồi), 20 kcal (salad rau)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.CjrQu4AfpeMH3PKPFzg1yAHaE8?w=272&h=181&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "thu_ba": {
        "sang": {
          "ten_mon": "Sinh tố chuối và bơ hạt nhân",
          "calo_tren_100g": "90 kcal (chuối), 600 kcal (bơ hạt nhân)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.LdVH9W6o2yQhAJ723atiEQHaEP?w=275&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Thịt bò xào rau cải xanh",
          "calo_tren_100g": "250 kcal (thịt bò), 20 kcal (rau cải)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.yd3h5S6HUR_3F5n_FHecpQHaEU?w=243&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Gà nướng và khoai tây nghiền",
          "calo_tren_100g": "165 kcal (gà nướng), 85 kcal (khoai tây nghiền)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.l--andsEBUFRn02b2ggrJAHaEK?w=286&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "thu_tu": {
        "sang": {
          "ten_mon": "Trái cây và yến mạch",
          "calo_tren_100g": "50 kcal (trái cây hỗn hợp), 389 kcal (yến mạch)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.yIF22ZVvgSmlj4J4LM0gTAHaE8?w=294&h=196&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Cơm và cá hồi",
          "calo_tren_100g": "130 kcal (cơm trắng), 208 kcal (cá hồi)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.TwqVjoG_cAesboblEMSZAQHaJ4?w=120&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Salad ức gà và rau xanh",
          "calo_tren_100g": "165 kcal (ức gà), 20 kcal (rau xanh)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.DEZNNi5rahfT9AZm6tHZPAHaHa?w=187&h=187&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "thu_nam": {
        "sang": {
          "ten_mon": "Bánh mì và trứng luộc",
          "calo_tren_100g": "265 kcal (bánh mì trắng), 155 kcal (trứng luộc)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.tXWW63f3q_UajZCEsQVDKQHaE7?w=241&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Gà luộc và rau sống",
          "calo_tren_100g": "165 kcal (gà luộc), 20 kcal (rau sống)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.dQ0KxNpKzwcjOTH3uenfJQHaE7?w=261&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Thịt nướng và bông cải xanh",
          "calo_tren_100g": "250 kcal (thịt nướng), 25 kcal (bông cải xanh)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.oLOgaUTWjZnEPNe6jkijwQHaEK?w=321&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "thu_sau": {
        "sang": {
          "ten_mon": "Yến mạch và sữa chua",
          "calo_tren_100g": "389 kcal (yến mạch), 60 kcal (sữa chua không đường)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.WcIJPpgUWieSS-dFhTI9QwHaE8?w=250&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Thịt heo nạc và rau luộc",
          "calo_tren_100g": "143 kcal (thịt heo nạc), 20 kcal (rau luộc)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.x7JWFm3cFty0ZCaoFVSLOgHaEL?w=372&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Cá và bún gạo lứt",
          "calo_tren_100g": "150 kcal (cá phi lê), 110 kcal (bún gạo lứt)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.7cNe22hPqaYVAaCPFAye1AHaHa?w=187&h=187&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "thu_bay": {
        "sang": {
          "ten_mon": "Smoothie rau xanh",
          "calo_tren_100g": "50 kcal",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.zjGTHph1CWBjc20n4L1gJgHaHa?w=179&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Cơm và thịt gà",
          "calo_tren_100g": "130 kcal (cơm trắng), 165 kcal (thịt gà)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.ADtowUbZY1H3KXS836jeYgHaEo?w=237&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Mì Ý và thịt bò băm",
          "calo_tren_100g": "158 kcal (mì Ý), 250 kcal (thịt bò băm)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.m6g7MK0mtuoRHgVcYMwF-gHaE8?w=270&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "chu_nhat": {
        "sang": {
          "ten_mon": "Bánh mì và trái cây",
          "calo_tren_100g": "265 kcal (bánh mì trắng), 50 kcal (trái cây hỗn hợp)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.b03zwmjbbdshS3PIuctQPwHaFj?w=224&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Salad cá ngừ và khoai lang",
          "calo_tren_100g": "184 kcal (cá ngừ đóng hộp), 86 kcal (khoai lang)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.35x-T_pGFIfdWZTaQXJNbAHaFt?w=220&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Gà hầm và rau củ",
          "calo_tren_100g": "165 kcal (thịt gà), 50 kcal (rau củ hầm)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.GFZHzo1kD9fcCEd8iNlEzAHaEL?w=279&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      }
    }
  },
  {
    "id": 2,
    "chi_so_co_the": {
      "suc_manh": 65,
      "suc_ben": 75,
      "tu_the": 78,
      "trao_doi_chat": 70,
      "do_deo_dai": 80
    },
    "thanh_phan_co_the": {
      "mo": "18%",
      "co": "38%",
      "nuoc": "58%"
    },
    "lich_tap_luyen": {
      "thu_hai": "Chạy bộ 4km",
      "thu_ba": "Tập vai và tay trước",
      "thu_tu": "Bơi lội",
      "thu_nam": "Tập ngực và bụng",
      "thu_sau": "Tập toàn thân nhẹ",
      "thu_bay": "Đi bộ đường dài",
      "chu_nhat": "Nghỉ ngơi"
    },
    "thuc_don_mau": {
      "thu_hai": {
        "sang": {
          "ten_mon": "Trái cây và yến mạch",
          "calo_tren_100g": "50 kcal (trái cây hỗn hợp), 389 kcal (yến mạch)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.yIF22ZVvgSmlj4J4LM0gTAHaE8?w=294&h=196&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Cơm và cá hồi",
          "calo_tren_100g": "130 kcal (cơm trắng), 208 kcal (cá hồi)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.TwqVjoG_cAesboblEMSZAQHaJ4?w=120&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Salad ức gà và rau xanh",
          "calo_tren_100g": "165 kcal (ức gà), 20 kcal (rau xanh)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.DEZNNi5rahfT9AZm6tHZPAHaHa?w=187&h=187&c=7&r=0&o=7&pid=1.7&rm=3"
        }

      },
      "thu_ba": {
        "sang": {
          "ten_mon": "Sinh tố chuối và bơ hạt nhân",
          "calo_tren_100g": "90 kcal (chuối), 600 kcal (bơ hạt nhân)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.LdVH9W6o2yQhAJ723atiEQHaEP?w=275&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Thịt bò xào rau cải xanh",
          "calo_tren_100g": "250 kcal (thịt bò), 20 kcal (rau cải)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.yd3h5S6HUR_3F5n_FHecpQHaEU?w=243&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Gà nướng và khoai tây nghiền",
          "calo_tren_100g": "165 kcal (gà nướng), 85 kcal (khoai tây nghiền)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.l--andsEBUFRn02b2ggrJAHaEK?w=286&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "thu_tu": {
        "sang": {
          "ten_mon": "Trứng ốp la và bánh mì nguyên cám",
          "calo_tren_100g": "150 kcal (trứng ốp la), 250 kcal (bánh mì nguyên cám)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.EqnJSN1Gihbr4LEvfi2fUgHaD4?w=301&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Cơm gạo lứt với ức gà",
          "calo_tren_100g": "130 kcal (gạo lứt), 165 kcal (ức gà)",
          "anh_mon_an": "https://i.ytimg.com/vi/m8V3ULygdoI/maxresdefault.jpg"
        },
        "toi": {
          "ten_mon": "Cá hồi nướng và salad",
          "calo_tren_100g": "208 kcal (cá hồi), 20 kcal (salad rau)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.CjrQu4AfpeMH3PKPFzg1yAHaE8?w=272&h=181&c=7&r=0&o=7&pid=1.7&rm=3"
        }

      },
      "thu_nam": {
        "sang": {
          "ten_mon": "Bánh mì và trứng luộc",
          "calo_tren_100g": "265 kcal (bánh mì trắng), 155 kcal (trứng luộc)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.tXWW63f3q_UajZCEsQVDKQHaE7?w=241&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Gà luộc và rau sống",
          "calo_tren_100g": "165 kcal (gà luộc), 20 kcal (rau sống)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.dQ0KxNpKzwcjOTH3uenfJQHaE7?w=261&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Thịt nướng và bông cải xanh",
          "calo_tren_100g": "250 kcal (thịt nướng), 25 kcal (bông cải xanh)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.oLOgaUTWjZnEPNe6jkijwQHaEK?w=321&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "thu_sau": {
        "sang": {
          "ten_mon": "Yến mạch và sữa chua",
          "calo_tren_100g": "389 kcal (yến mạch), 60 kcal (sữa chua không đường)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.WcIJPpgUWieSS-dFhTI9QwHaE8?w=250&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Thịt heo nạc và rau luộc",
          "calo_tren_100g": "143 kcal (thịt heo nạc), 20 kcal (rau luộc)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.x7JWFm3cFty0ZCaoFVSLOgHaEL?w=372&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Cá và bún gạo lứt",
          "calo_tren_100g": "150 kcal (cá phi lê), 110 kcal (bún gạo lứt)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.7cNe22hPqaYVAaCPFAye1AHaHa?w=187&h=187&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "thu_bay": {
        "sang": {
          "ten_mon": "Smoothie rau xanh",
          "calo_tren_100g": "50 kcal",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.zjGTHph1CWBjc20n4L1gJgHaHa?w=179&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Cơm và thịt gà",
          "calo_tren_100g": "130 kcal (cơm trắng), 165 kcal (thịt gà)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.ADtowUbZY1H3KXS836jeYgHaEo?w=237&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Mì Ý và thịt bò băm",
          "calo_tren_100g": "158 kcal (mì Ý), 250 kcal (thịt bò băm)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.m6g7MK0mtuoRHgVcYMwF-gHaE8?w=270&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "chu_nhat": {
        "sang": {
          "ten_mon": "Trái cây và yến mạch",
          "calo_tren_100g": "50 kcal (trái cây hỗn hợp), 389 kcal (yến mạch)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.yIF22ZVvgSmlj4J4LM0gTAHaE8?w=294&h=196&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Cơm và cá hồi",
          "calo_tren_100g": "130 kcal (cơm trắng), 208 kcal (cá hồi)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.TwqVjoG_cAesboblEMSZAQHaJ4?w=120&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Salad ức gà và rau xanh",
          "calo_tren_100g": "165 kcal (ức gà), 20 kcal (rau xanh)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.DEZNNi5rahfT9AZm6tHZPAHaHa?w=187&h=187&c=7&r=0&o=7&pid=1.7&rm=3"
        }

      }
    }
  },
  {
    "id": 3,
    "chi_so_co_the": {
      "suc_manh": 72,
      "suc_ben": 68,
      "tu_the": 82,
      "trao_doi_chat": 78,
      "do_deo_dai": 72
    },
    "thanh_phan_co_the": {
      "mo": "14%",
      "co": "42%",
      "nuoc": "62%"
    },
    "lich_tap_luyen": {
      "thu_hai": "Tập ngực và tay sau",
      "thu_ba": "Chạy bộ 6km",
      "thu_tu": "Tập lưng và tay trước",
      "thu_nam": "Yoga và thiền",
      "thu_sau": "Tập chân và bụng",
      "thu_bay": "Bơi lội",
      "chu_nhat": "Nghỉ ngơi"
    },
    "thuc_don_mau": {
      "thu_hai": {
        "sang": {
          "ten_mon": "Trái cây và yến mạch",
          "calo_tren_100g": "50 kcal (trái cây hỗn hợp), 389 kcal (yến mạch)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.yIF22ZVvgSmlj4J4LM0gTAHaE8?w=294&h=196&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Cơm và cá hồi",
          "calo_tren_100g": "130 kcal (cơm trắng), 208 kcal (cá hồi)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.TwqVjoG_cAesboblEMSZAQHaJ4?w=120&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Salad ức gà và rau xanh",
          "calo_tren_100g": "165 kcal (ức gà), 20 kcal (rau xanh)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.DEZNNi5rahfT9AZm6tHZPAHaHa?w=187&h=187&c=7&r=0&o=7&pid=1.7&rm=3"
        }

      },
      "thu_ba": {
        "sang": {
          "ten_mon": "Sinh tố chuối và bơ hạt nhân",
          "calo_tren_100g": "90 kcal (chuối), 600 kcal (bơ hạt nhân)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.LdVH9W6o2yQhAJ723atiEQHaEP?w=275&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Thịt bò xào rau cải xanh",
          "calo_tren_100g": "250 kcal (thịt bò), 20 kcal (rau cải)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.yd3h5S6HUR_3F5n_FHecpQHaEU?w=243&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Gà nướng và khoai tây nghiền",
          "calo_tren_100g": "165 kcal (gà nướng), 85 kcal (khoai tây nghiền)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.l--andsEBUFRn02b2ggrJAHaEK?w=286&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "thu_tu": {
        "sang": {
          "ten_mon": "Trứng ốp la và bánh mì nguyên cám",
          "calo_tren_100g": "150 kcal (trứng ốp la), 250 kcal (bánh mì nguyên cám)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.EqnJSN1Gihbr4LEvfi2fUgHaD4?w=301&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Thịt nướng và bông cải xanh",
          "calo_tren_100g": "250 kcal (thịt nướng), 25 kcal (bông cải xanh)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.oLOgaUTWjZnEPNe6jkijwQHaEK?w=321&h=180&c=7&r=0&o=7&pid=1.7&rm=3"

        },
        "toi": {
          "ten_mon": "Cá hồi nướng và salad",
          "calo_tren_100g": "208 kcal (cá hồi), 20 kcal (salad rau)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.CjrQu4AfpeMH3PKPFzg1yAHaE8?w=272&h=181&c=7&r=0&o=7&pid=1.7&rm=3"
        }

      },
      "thu_nam": {
        "sang": {
          "ten_mon": "Bánh mì và trứng luộc",
          "calo_tren_100g": "265 kcal (bánh mì trắng), 155 kcal (trứng luộc)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.tXWW63f3q_UajZCEsQVDKQHaE7?w=241&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Gà luộc và rau sống",
          "calo_tren_100g": "165 kcal (gà luộc), 20 kcal (rau sống)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.dQ0KxNpKzwcjOTH3uenfJQHaE7?w=261&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Thịt nướng và bông cải xanh",
          "calo_tren_100g": "250 kcal (thịt nướng), 25 kcal (bông cải xanh)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.oLOgaUTWjZnEPNe6jkijwQHaEK?w=321&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "thu_sau": {
        "sang": {
          "ten_mon": "Yến mạch và sữa chua",
          "calo_tren_100g": "389 kcal (yến mạch), 60 kcal (sữa chua không đường)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.WcIJPpgUWieSS-dFhTI9QwHaE8?w=250&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Thịt heo nạc và rau luộc",
          "calo_tren_100g": "143 kcal (thịt heo nạc), 20 kcal (rau luộc)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.x7JWFm3cFty0ZCaoFVSLOgHaEL?w=372&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Cá và bún gạo lứt",
          "calo_tren_100g": "150 kcal (cá phi lê), 110 kcal (bún gạo lứt)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.7cNe22hPqaYVAaCPFAye1AHaHa?w=187&h=187&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "thu_bay": {
        "sang": {
          "ten_mon": "Smoothie rau xanh",
          "calo_tren_100g": "50 kcal",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.zjGTHph1CWBjc20n4L1gJgHaHa?w=179&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "trua": {
          "ten_mon": "Cơm và thịt gà",
          "calo_tren_100g": "130 kcal (cơm trắng), 165 kcal (thịt gà)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.ADtowUbZY1H3KXS836jeYgHaEo?w=237&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Mì Ý và thịt bò băm",
          "calo_tren_100g": "158 kcal (mì Ý), 250 kcal (thịt bò băm)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.m6g7MK0mtuoRHgVcYMwF-gHaE8?w=270&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        }
      },
      "chu_nhat": {
        "sang": {
          "ten_mon": "Cơm gạo lứt với ức gà",
          "calo_tren_100g": "130 kcal (gạo lứt), 165 kcal (ức gà)",
          "anh_mon_an": "https://i.ytimg.com/vi/m8V3ULygdoI/maxresdefault.jpg"

        },
        "trua": {
          "ten_mon": "Cơm và cá hồi",
          "calo_tren_100g": "130 kcal (cơm trắng), 208 kcal (cá hồi)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.TwqVjoG_cAesboblEMSZAQHaJ4?w=120&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
        },
        "toi": {
          "ten_mon": "Salad ức gà và rau xanh",
          "calo_tren_100g": "165 kcal (ức gà), 20 kcal (rau xanh)",
          "anh_mon_an": "https://th.bing.com/th/id/OIP.DEZNNi5rahfT9AZm6tHZPAHaHa?w=187&h=187&c=7&r=0&o=7&pid=1.7&rm=3"
        }

      }
    }
  },


]


const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Lấy hàm setAnalysisData từ AuthContext
  const { setAnalysisData } = useContext(AuthContext);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const token = Cookies.get('accessToken');
      try {
        const response = await fetch('https://d5f9-42-114-121-153.ngrok-free.app/chat/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result: { data: HistoryResponse[] } = await response.json();
        if (Array.isArray(result.data) && result.data.length > 0) {
          const history: Message[] = result.data.map((msg) => ({
            id: Date.parse(msg.createdAt),
            role: msg.role,
            content: msg.content,
          }));
          setMessages(history);
        }
      } catch (err) {
        console.error('Lỗi khi lấy lịch sử:', err);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const handleChat = async (text: string, images: UploadFile[]) => {
    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      images,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    const token = Cookies.get('accessToken');
    try {
      const response = await fetch('https://d5f9-42-114-121-153.ngrok-free.app/chat/normal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: text }),
      });
      const result: { reply: string } = await response.json();
      const botReply: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: result.reply,
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          content: '⚠️ Đã xảy ra lỗi khi gửi tin nhắn.',
        },
      ]);
    }
    setLoading(false);
  };

  // Đối tượng ánh xạ từ key tiếng Anh sang tiếng Việt
  const dayMap: { [key: string]: string } = {
    "thu_hai": "Thứ hai",
    "thu_ba": "Thứ ba",
    "thu_tu": "Thứ tư",
    "thu_nam": "Thứ năm",
    "thu_sau": "Thứ sáu",
    "thu_bay": "Thứ bảy",
    "chu_nhat": "Chủ nhật",
  };

  const handleAnalyzeSubmit = async () => {
    setLoading(true);
    try {
      // Chọn một mục ngẫu nhiên từ analyzeData
      const randomIndex = Math.floor(Math.random() * analyzeData.length);
      const randomData = analyzeData[randomIndex];

      // Tạo một đối tượng dữ liệu với tên trường bằng tiếng Anh, phù hợp với type AnalysisData
      const analysisResult: AnalysisData = {
        bodyStats: {
          strength: randomData.chi_so_co_the.suc_manh,
          endurance: randomData.chi_so_co_the.suc_ben,
          posture: randomData.chi_so_co_the.tu_the,
          metabolism: randomData.chi_so_co_the.trao_doi_chat,
          flexibility: randomData.chi_so_co_the.do_deo_dai,
        },
        bodyComposition: {
          fat: randomData.thanh_phan_co_the.mo,
          muscle: randomData.thanh_phan_co_the.co,
          water: randomData.thanh_phan_co_the.nuoc,
        },
        workoutSchedule: randomData.lich_tap_luyen,
        mealPlan: randomData.thuc_don_mau,
      };

      // Lưu trữ dữ liệu phân tích vào Context
      setAnalysisData(analysisResult);

      // Định dạng dữ liệu thành chuỗi để hiển thị
      const formatted = `📊 *Chỉ số cơ thể*
- Sức mạnh: ${randomData.chi_so_co_the.suc_manh}
- Sức bền: ${randomData.chi_so_co_the.suc_ben}
- Tư thế: ${randomData.chi_so_co_the.tu_the}
- Trao đổi chất: ${randomData.chi_so_co_the.trao_doi_chat}
- Độ dẻo dai: ${randomData.chi_so_co_the.do_deo_dai}

💪 *Thành phần cơ thể*
- Mỡ: ${randomData.thanh_phan_co_the.mo}
- Cơ: ${randomData.thanh_phan_co_the.co}
- Nước: ${randomData.thanh_phan_co_the.nuoc}

🏋️ *Lịch tập luyện*
${Object.entries(randomData.lich_tap_luyen).map(([dayKey, activity]) => `- ${dayMap[dayKey] || dayKey}: ${activity}`).join('\n')}

🍽️ *Thực đơn mẫu*
${Object.entries(randomData.thuc_don_mau).map(
        ([dayKey, meals]) =>
          `- ${dayMap[dayKey] || dayKey}:
   🥣 Sáng: ${meals.sang.ten_mon} (${meals.sang.calo_tren_100g})
   🍛 Trưa: ${meals.trua.ten_mon} (${meals.trua.calo_tren_100g})
   🍲 Tối: ${meals.toi.ten_mon} (${meals.toi.calo_tren_100g})`
      ).join('\n\n')}`;

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: 'assistant',
            content: formatted,
          },
        ]);
        setLoading(false);
      }, 5000);

    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'assistant',
          content: 'Có lỗi xảy ra khi tạo dữ liệu phân tích.',
        },
      ]);
      setLoading(false); // Ngừng loading ngay cả khi có lỗi
    }
  };

  return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', border: '1px solid #f0f0f0' }}>
      <Content style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#fafafa' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {messages.length === 0 && !loading && !modalOpen && (
            <Row justify="center">
              <Col>
                <Text type="secondary" style={{ cursor: 'pointer', fontStyle: 'italic' }} onClick={() => setModalOpen(true)}>
                  👉 Bắt đầu trò chuyện với FitSight
                </Text>
              </Col>
            </Row>
          )}

          {messages.map((msg) => (
            <Row key={msg.id} justify={msg.role === 'user' ? 'end' : 'start'} wrap>
              <Col xs={22} sm={20} md={18} lg={16}>
                <Space align="start" style={{ background: msg.role === 'user' ? '#e6f7ff' : '#f6ffed', padding: '12px', borderRadius: '12px', display: 'flex', width: '100%' }} direction="vertical">
                  <Space>
                    <Avatar icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} style={{ backgroundColor: msg.role === 'user' ? '#1890ff' : '#52c41a' }} />
                    <Text style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{msg.content}</Text>
                  </Space>
                  {msg.images && msg.images.length > 0 && (
                    <Space wrap>
                      {msg.images.map((file) => (
                        <img key={file.uid} src={URL.createObjectURL(file.originFileObj as Blob)} alt={file.name} style={{ maxWidth: 100, borderRadius: 8, objectFit: 'cover' }} />
                      ))}
                    </Space>
                  )}
                </Space>
              </Col>
            </Row>
          ))}

          {loading && (
            <Row justify="start">
              <Col xs={22} sm={20} md={18} lg={16}>
                <Space align="start" style={{ background: '#f6ffed', padding: '12px', borderRadius: '12px', display: 'flex', width: '100%' }}>
                  <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
                  <Spin size="small" />
                </Space>
              </Col>
            </Row>
          )}

          <div ref={bottomRef} />
        </Space>
      </Content>
      <SendMessageForm onChat={handleChat} />

      <FitSightSteps open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAnalyzeSubmit} />
    </div>
  );
};

export default Home;