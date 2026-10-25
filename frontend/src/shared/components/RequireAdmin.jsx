import { useAdminMode } from '../context/AdminModeContext';
import NotAuthorisedPage from './NotAuthorisedPage';

const RequireAdmin = ({ children }) => {
  const { isAdmin } = useAdminMode();
  return isAdmin ? children : <NotAuthorisedPage />;
};

export default RequireAdmin;
