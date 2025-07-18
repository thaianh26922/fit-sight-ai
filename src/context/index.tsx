import { createContext, useEffect, useState } from "react";

// Định nghĩa kiểu dữ liệu cho từng phần của dữ liệu phân tích
type BodyStats = {
  strength: number;
  endurance: number;
  posture: number;
  metabolism: number;
  flexibility: number;
};

type BodyComposition = {
  fat: string;
  muscle: string;
  water: string;
};

type WorkoutSchedule = {
  [key: string]: string;
};

// --- MODIFIED MealPlan TYPE ---
type MealDetail = {
  ten_mon: string;
  calo_tren_100g: string;
  anh_mon_an: string;
};

type DailyMeals = {
  sang: MealDetail;
  trua: MealDetail;
  toi: MealDetail;
};

export type MealPlan = {
  [key: string]: DailyMeals;
};
// --- END MODIFIED MealPlan TYPE ---

// Kiểu dữ liệu tổng hợp cho toàn bộ kết quả phân tích
export type AnalysisData = {
  bodyStats: BodyStats;
  bodyComposition: BodyComposition;
  workoutSchedule: WorkoutSchedule;
  mealPlan: MealPlan;
};

type User = {
  id: number;
  email: string;
  name: string;
  password: string;
  createDate: string;
};

// Cập nhật AuthContextType với các trường mới
type AuthContextType = {
  userList: User[] | null;
  currentUser: User | null;
  analysisData: AnalysisData | null; // Thêm trường này
  refreshUserList: () => void;
  setCurrentUser: (user: User | null) => void;
  setAnalysisData: (data: AnalysisData | null) => void; // Thêm hàm này
};

export const AuthContext = createContext<AuthContextType>({
  userList: null,
  currentUser: null,
  analysisData: null,
  refreshUserList: () => {},
  setCurrentUser: () => {},
  setAnalysisData: () => {},
});

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [userList, setUserList] = useState<User[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Thêm state để lưu trữ dữ liệu phân tích
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const refreshUserList = () => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUserList(JSON.parse(storedUsers));
    } else {
      setUserList(null);
    }
  };

  useEffect(() => {
    refreshUserList();
    const storedCurrentUser = localStorage.getItem("currentUser");
    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        userList,
        currentUser,
        analysisData, 
        setAnalysisData, 
        refreshUserList,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;