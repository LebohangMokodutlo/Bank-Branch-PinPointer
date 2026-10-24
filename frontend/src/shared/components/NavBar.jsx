import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Branch Locator' },
  { to: '/search-analytics', label: 'Search Analytics' },
  { to: '/manage-branches', label: 'Manage Branches' },
];

const NavBar = () => {
  return (
    <nav className="flex gap-3 border-b border-gray-200 bg-white px-6 py-3">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) =>
            `rounded-md border px-4 py-2 text-sm font-medium ${
              isActive
                ? 'border-primary bg-primary text-white'
                : 'border-primary text-primary hover:bg-primary-light'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default NavBar;
