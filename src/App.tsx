import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { AppLayout } from '@/components/layout/AppLayout';

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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<div className="p-6">Home</div>} />
            <Route path="communities" element={<div className="p-6">Communities</div>} />
            <Route path="projects" element={<div className="p-6">Projects</div>} />
            <Route path="roadmaps" element={<div className="p-6">Roadmaps</div>} />
          </Route>
          <Route path="login" element={<div className="p-6">Login</div>} />
          <Route path="register" element={<div className="p-6">Register</div>} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
