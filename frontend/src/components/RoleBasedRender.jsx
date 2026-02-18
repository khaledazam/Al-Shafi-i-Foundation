import { useAuth } from '../context/AuthContext';

const RoleBasedRender = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !allowedRoles.includes(user?.role)) {
        return null;
    }

    return <>{children}</>;
};

export default RoleBasedRender;
