import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link to="/" aria-label="Letopia home">
      <img src="/assets/logo.svg" alt="" className={className} />
    </Link>
  );
}
