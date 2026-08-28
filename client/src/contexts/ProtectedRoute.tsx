import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store.ts';
export const ProtectedRoute =()=> {
    const user = useSelector((state:RootState)=>state.user)
    // const loading = useSelector((state:RootState)=>state.loading)


    // console.log(user)
    // if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
