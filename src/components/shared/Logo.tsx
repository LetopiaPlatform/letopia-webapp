import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link to="/" aria-label="Letopia home">
      <span className={`font-bold text-2xl text-[#824892] ${className ?? ''}`}>LeTopia</span>
    </Link>
  );
}
