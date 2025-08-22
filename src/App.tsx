import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import CommunityLayout from './community/CommunityLayout';
import Header from './header/Header';
import MyPage from './mypage/Mypage';
import MypageContent from './mypage/components/MypageContent';
import Challenge from './mypage/components/Challenge';
import Login from './login/Login';
import MyCalendar from './mypage/components/Calendar';
import LandingPage from '@landing/LandingPage';
import CommunityAll from './community/category/CommunityAll';
import CreatePost from './community/form/CreatePost';
import CommunityFree from './community/category/CommunityFree';
import CommunityShare from './community/category/CommunityShare';
import AiPage from './ai/AiPage';
import CommunityStudy from './community/category/CommunityStudy';
import PostDetail from './community/post/PostDetail';
import { useCallback, useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import axios from 'axios';

function AppContent() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const location = useLocation();
  const navigate = useNavigate();

  const checkLogin = useCallback(async () => {
    try {
      const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo', {
        withCredentials: true,
      });
      if (!isLoggedIn) setAuthData(res.data);
    } catch (err: any) {
      if (!user) return;
      // 401이면 리프레시 토큰으로 재발급 시도

      if (axios.isAxiosError(err) && err.response?.status === 401) {
        try {
          await axios.post('https://backend.evida.site/api/v1/users/auth/refresh', {
            withCredentials: true,
          });
          //갱신 후 유저 정보 재 조회
          const res2 = await axios.get('https://backend.evida.site/api/v1/users/myinfo', {
            withCredentials: true,
          });
          setAuthData(res2.data);
        } catch {
          // 재발급 실패 시 로그아웃
          logout();
          navigate('/');
        }
      } else {
        console.error(err);
      }
    }
  }, [setAuthData, logout, isLoggedIn, navigate]);

  useEffect(() => {
    if (location.pathname !== '/login' && !isLoggedIn) {
      checkLogin();
    }
  }, [location.pathname, checkLogin, isLoggedIn]);

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/community/create" element={<CreatePost />} />
          <Route path="/community" element={<CommunityLayout />}>
            <Route index element={<CommunityAll />} />
            <Route path="free" element={<CommunityFree />} />
            <Route path="share" element={<CommunityShare />} />
            <Route path="study" element={<CommunityStudy />} />
            <Route path=":category/:id" element={<PostDetail />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />}>
            <Route index element={<MypageContent />} />
            <Route path="calendar" element={<MyCalendar />} />
            <Route path="challenge" element={<Challenge />} />
          </Route>
          <Route path="/ai" element={<AiPage />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
