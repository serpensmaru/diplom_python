import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkUser } from '../redux/slices/authSlice';
import Loading from './Loading';

const AdminRoute = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(checkUser())
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [dispatch]);

    if (loading) {
        return <Loading />
    }

    return user && user.is_staff ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
