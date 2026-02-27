import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';

function HomePage() {
  return (
    <div className="p-8 text-2xl font-bold flex items-center justify-center">
      Welcome to Letopia
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="h-screen text-2xl flex flex-col items-center justify-center">
      <span className="text-4xl font-bold">404</span>
      <p>Page not found</p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
