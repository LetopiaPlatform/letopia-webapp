import { Ellipse } from '@/components/ui/Ellipse';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { Skeleton } from './ui/skeleton';

const ELLIPSES = [
  { size: 100, initialX: 10, initialY: 20, animation: 'drift 60s ease infinite' },
  { size: 50, initialX: 60, initialY: 50, animation: 'drift-2 50s ease infinite' },
  { size: 40, initialX: 0, initialY: 60, animation: 'drift 60s ease infinite' },
  { size: 60, initialX: 40, initialY: 30, animation: 'drift-3 40s ease infinite' },
  { size: 30, initialX: 40, initialY: 70, animation: 'drift 60s ease infinite' },
  { size: 80, initialX: 80, initialY: 0, animation: 'drift-2 50s ease infinite' },
  { size: 50, initialX: 95, initialY: 70, animation: 'drift 60s ease infinite' },
];

type HeroSectionProps = {
  isLoading?: boolean;
};

export function HeroSection({ isLoading }: HeroSectionProps) {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const handleCreateCommunity = () => {
    if (isAuthenticated) {
      navigate('/communities/create');
    } else {
      navigate('/login', { state: { redirectTo: '/communities/create' } });
    }
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-auto mt-20 py-6 px-4 sm:px-8 md:py-3 lg:py-4 md:px-25 xl:h-110 mb-5">
        <div className="w-full flex flex-col md:flex-row justify-around items-center gap-6">
          {/* Illustration skeleton */}
          <Skeleton className="w-40 md:w-60 xl:w-80 aspect-square rounded-2xl shrink-0" />

          {/* Content skeleton */}
          <div className="flex flex-col items-center gap-4 w-full max-w-xl px-4 md:px-0">
            <Skeleton className="h-6 sm:h-7 w-3/4 rounded-full" />
            <Skeleton className="h-4 sm:h-5 w-full" />
            <Skeleton className="h-4 sm:h-5 w-5/6" />
            <Skeleton className="h-9 sm:h-10 w-36 sm:w-40 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full h-auto xl:h-110 mt-20 py-6 px-2 md:py-3 lg:py-4 md:px-25 shadow-md mb-5">
      {/* background */}
      <div className="absolute inset-0">
        {ELLIPSES.map((ellipse, index) => (
          <Ellipse key={index} {...ellipse} />
        ))}
      </div>

      <div className="w-full relative z-1 flex flex-col md:flex-row justify-around items-center">
        {/* Illustration */}
        <div className="relative w-70 md:w-150 xl:w-110 aspect-square">
          <img
            src="/assets/hero-img.svg"
            alt="Hero illustration"
            className="w-full md:absolute left-0 -bottom-7 xl:bottom-3"
          />
        </div>
        {/* Content */}
        <div className="flex flex-col items-center gap-4 max-w-xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-semibold leading-tight md:leading-11.25 text-center">
            Find Your <span className="font-agbalumo text-gradient">LeTopia</span>
          </h2>
          <p className="text-body text-muted-foreground px-4 md:px-1  text-sm sm:text-base md:text-lg lg:text-xl tracking-wide leading-7 md:leading-8 lg:leading-10 text-center">
            Discover communities, join discussions, and connect with people who share your passions.
          </p>
          <Button
            variant="default"
            onClick={handleCreateCommunity}
            className="has-[>svg]:px-5 sm:has-[>svg]:px-7  py-5 md:py-6 rounded-xl text-white text-base sm:text-lg font-normal cursor-pointer"
          >
            <Plus className="size-4 sm:size-5" /> create community
          </Button>
        </div>
      </div>
    </div>
  );
}
