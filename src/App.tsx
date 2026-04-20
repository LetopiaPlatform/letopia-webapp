import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from '@/components/ui/sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { FeatureGate } from '@/components/shared/FeatureGate';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { HomePage } from '@/pages/HomePage';
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { VerifyResetCodePage } from '@/pages/auth/VerifyResetCodePage';
import { SetPasswordPage } from '@/pages/auth/SetPasswordPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { SettingsPage } from './pages/profile/SettingsPage';
import { CommunitiesPage } from './pages/communities/CommunitiesPage';
import { CommunityDetailPage } from './pages/communities/CommunityDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route
                  path="communities"
                  element={
                    <FeatureGate feature="communitiesPage">
                      <CommunitiesPage />
                    </FeatureGate>
                  }
                />
                <Route
                  path="communities/:slug"
                  element={
                    <FeatureGate feature="communitiesPage">
                      <CommunityDetailPage />
                    </FeatureGate>
                  }
                />
                <Route
                  path="projects"
                  element={
                    <FeatureGate feature="projectsPage">
                      <div className="p-6">Projects</div>
                    </FeatureGate>
                  }
                />
                <Route
                  path="roadmaps"
                  element={
                    <FeatureGate feature="roadmapsPage">
                      <div className="p-6">Roadmaps</div>
                    </FeatureGate>
                  }
                />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="verify-email" element={<VerifyEmailPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="verify-reset-code" element={<VerifyResetCodePage />} />
                <Route path="reset-password" element={<SetPasswordPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
