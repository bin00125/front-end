import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  nickname: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isAuthChecked: boolean; // 인증 확인 완료 여부
  setAuthData: (user: User) => void;
  logout: () => void;
  setAuthChecked: () => void; // 인증 확인 완료 표시
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isAuthChecked: false,
  setAuthData: (user) =>
    set({
      user,
      isLoggedIn: true,
      isAuthChecked: true, // 로그인 성공시 확인 완료
    }),
  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      isAuthChecked: true, // 로그아웃해도 확인은 완료
    }),
  setAuthChecked: () => set({ isAuthChecked: true }),
}));

export default useAuthStore;
