import { NavLink } from 'react-router-dom';
import { useAdminMode } from '../context/AdminModeContext';
import { routes } from '../../constants';

const ALWAYS_VISIBLE_LINKS = [{ to: routes.home, label: 'Branch Locator' }];

const ADMIN_ONLY_LINKS = [
  { to: routes.searchAnalytics, label: 'Search Analytics' },
  { to: routes.manageBranches, label: 'Manage Branches' },
];

const linkClassName = ({ isActive }) =>
  `rounded-md border px-4 py-2 text-sm font-medium ${
    isActive
      ? 'border-primary bg-primary text-white'
      : 'border-primary text-primary hover:bg-primary-light'
  }`;

const NavBar = () => {
  const { isAdmin, setIsAdmin } = useAdminMode();
  const links = isAdmin ? [...ALWAYS_VISIBLE_LINKS, ...ADMIN_ONLY_LINKS] : ALWAYS_VISIBLE_LINKS;

  return (
    <nav className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.to === routes.home} className={linkClassName}>
          {link.label}
        </NavLink>
      ))}

      <label className="ml-auto flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(event) => setIsAdmin(event.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        Admin mode
      </label>
    </nav>
  );
};

export default NavBar;
