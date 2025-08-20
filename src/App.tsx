import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
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
import EditPost from './community/form/EditPost';
import CommunityStudy from './community/category/CommunityStudy';
import PostDetailMock from './community/post/PostDetail';
import { useCallback, useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import axios from 'axios';

function AppContent() {
  const location = useLocation();
  const { isInitialized, setAuthData, logout, setInitialized } = useAuthStore();

  // localStorage 플래그 체크 함수
  const hasAuthFlag = useCallback((): boolean => {
    return localStorage.getItem('hasAuthToken') === 'true';
  }, []);

  const checkLogin = useCallback(async () => {
    try {
      const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo', {
        withCredentials: true,
      });
      setAuthData(res.data); // 성공시 localStorage 플래그 저장
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        logout();
      } else {
        console.error('Auth check error:', err);
      }
      setInitialized();
    }
  }, [setAuthData, logout, setInitialized]);

  useEffect(() => {
    if (!isInitialized) {
      if (location.pathname === '/login') {
        // 로그인 페이지는 바로 초기화
        setInitialized();
      } else if (hasAuthFlag()) {
        // localStorage 플래그가 있을 때만 API 호출
        checkLogin();
      } else {
        // 플래그가 없으면 API 호출 없이 바로 초기화
        setInitialized();
      }
    }
  }, [isInitialized, location.pathname, checkLogin, setInitialized]);

  // 초기화가 완료되지 않았으면 로딩 표시
  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
        }}
      >
        Loading...
      </div>
    );
  }

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
            <Route path="/community/:category/:id" element={<PostDetailMock />} />
            <Route path="/community/:category/:id/edit" element={<EditPost />} />
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
