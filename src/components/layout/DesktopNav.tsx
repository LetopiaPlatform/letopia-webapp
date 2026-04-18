import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '@/lib/constants';

export function DesktopNav() {
  return (
    <ul className="hidden lg:flex items-center lg:gap-6 xl:gap-10 shrink-0">
      {NAV_LINKS.map((link) => (
        <li key={link.href}>
          <NavLink
            to={link.href}
            className={({ isActive }) =>
              `flex items-center gap-2 text-base font-medium transition-colors ${
                isActive ? 'font-semibold text-black' : 'text-[#24252C] hover:text-black'
              }`
            }
          >
            <img src={link.icon} alt="" aria-hidden="true" className="size-5" />
            <span>{link.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
