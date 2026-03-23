import { useEffect, useState } from 'react';
import { FILTER_OPTIONS } from '@/lib/constants';
import { Logo } from '../shared/Logo';
import { Link } from 'react-router-dom';
import { Menu, User, LogOut } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchInput } from '../SearchInput';
import { useSearch } from '@/hooks/useSearch';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthContext();

  const { placeholder, setSearch } = useSearch();
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  return (
    <header className="bg-[#FDFDFD] shadow-md fixed top-0 left-0 z-50 w-full">
      <nav className="mx-auto flex h-20 items-center justify-between px-3 md:px-6 lg:justify-evenly lg:px-0">
        {/* Logo */}
        <Logo className="h-14.5 w-auto" />

        {/* Search bar — only when authenticated */}
        {isAuthenticated && (
          <SearchBar className="flex-1 mx-2 sm:mx-4 lg:mx-6 lg:max-w-60 xl:max-w-80 2xl:max-w-101.5" />
        )}

        {/* Search */}
        <div className="lg:flex w-60 xl:w-96">
          <SearchInput
            placeholder={placeholder}
            value={searchValue}
            onChange={setSearchValue}
            showFilter
            filterOptions={FILTER_OPTIONS}
            activeFilter={location.pathname.replace('/', '')}
          />
        </div>

        {/* Desktop auth actions */}
        <div className="relative hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="size-12">
                    <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                    <AvatarFallback className="bg-[#834496] text-white text-caption font-semibold">
                      {getInitials(user?.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-body font-semibold">
                  {user?.fullName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-36.5 h-12.5 rounded-[14px] bg-[#824892] hover:bg-[#6f3a80] text-lg font-medium text-[#FDFDFD] transition-colors"
            >
              Log in
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="lg:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <MobileMenu
          isAuthenticated={isAuthenticated}
          user={user}
          onClose={() => setMobileMenuOpen(false)}
          onLogout={logout}
        />
      )}
    </header>
  );
}
