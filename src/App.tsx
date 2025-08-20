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
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const setAuthChecked = useAuthStore((state) => state.setAuthChecked);
  const location = useLocation();

  const checkLogin = useCallback(async () => {
    try {
      const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo', {
        withCredentials: true,
      });
      setAuthData(res.data);
    } catch (err: any) {
      // 401이면 조용히 로그아웃 처리
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        logout();
      } else {
        // 다른 에러는 콘솔에 출력하고 인증 확인만 완료 처리
        console.error(err);
        setAuthChecked();
      }
    }
  }, [setAuthData, logout, setAuthChecked]);

  useEffect(() => {
    // 한 번도 인증 확인을 하지 않았고, 로그인 페이지가 아닌 경우에만 확인
    if (!isAuthChecked && location.pathname !== '/login') {
      checkLogin();
    }
  }, [isAuthChecked, location.pathname, checkLogin]);

  // 인증 확인이 완료되지 않았으면 로딩 표시
  if (!isAuthChecked) {
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
