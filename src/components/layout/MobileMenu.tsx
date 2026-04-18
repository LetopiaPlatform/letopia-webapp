import { Link, NavLink } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface MobileMenuProps {
  isAuthenticated: boolean;
  user: { fullName?: string; avatarUrl?: string } | null;
  onClose: () => void;
  onLogout: () => void;
}

export function MobileMenu({ isAuthenticated, user, onClose, onLogout }: MobileMenuProps) {
  return (
    <div className="lg:hidden border-t border-border bg-[#FDFDFD] px-6 pb-4">
      {/* Nav links */}
      <ul className="flex flex-col gap-2 py-4">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <NavLink
              to={link.href}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-body font-semibold transition-colors ${
                  isActive
                    ? 'text-black bg-accent'
                    : 'text-[#24252c] hover:text-black hover:bg-accent'
                }`
              }
            >
              <img src={link.icon} alt="" aria-hidden="true" className="size-5" />
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Auth section */}
      <div className="flex flex-col gap-3 border-t border-border pt-4">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar size="sm">
                <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                <AvatarFallback className="bg-[#834496] text-white text-[10px] font-semibold">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-body font-semibold text-foreground">{user?.fullName}</span>
            </div>
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-body font-semibold text-[#24252c] hover:text-black hover:bg-accent transition-colors"
            >
              <User className="size-4" />
              Profile
            </Link>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-body font-semibold text-destructive hover:bg-accent transition-colors cursor-pointer"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-[14px] bg-[#824892] hover:bg-[#6f3a80] h-12.5 text-lg font-medium text-[#FDFDFD] transition-colors"
          >
            Log in
          </Link>
        )}
      </div>
    </div>
  );
}
