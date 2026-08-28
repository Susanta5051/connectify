import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store.ts';

export function PublicRoute() {
  const user = useSelector((state:RootState)=>state.user)
  const loading = useSelector((state:RootState)=>state.loading)

  // if (loading) return <div className="text-white text-center mt-20">Verifying session...</div>;

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
