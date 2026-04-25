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
      <div className="relative w-full py-4 px-4 sm:px-8 md:py-3 md:px-10">
        <div className="w-full flex flex-col md:flex-row justify-around items-center gap-6">
          <Skeleton className="w-40 md:w-48 aspect-square rounded-2xl shrink-0" />
          <div className="flex flex-col items-center gap-3 w-full max-w-md px-4 md:px-0">
            <Skeleton className="h-6 sm:h-7 w-3/4 rounded-full" />
            <Skeleton className="h-4 sm:h-5 w-full" />
            <Skeleton className="h-4 sm:h-5 w-5/6" />
            <Skeleton className="h-10 w-44 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full py-4 px-2 md:py-3 md:px-10">
      <div className="absolute inset-0">
        {ELLIPSES.map((ellipse, index) => (
          <Ellipse key={index} {...ellipse} />
        ))}
      </div>

      <div className="w-full relative z-1 flex flex-col md:flex-row justify-around items-center">
        <div className="relative w-50 md:w-60 xl:w-72 aspect-square">
          <img
            src="/assets/hero-img.svg"
            alt="Hero illustration"
            className="w-full md:absolute left-0 bottom-0"
          />
        </div>
        <div className="flex flex-col items-center gap-3 max-w-md">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight text-center">
            Find Your <span className="font-agbalumo text-gradient">LeTopia</span>
          </h2>
          <p className="text-muted-foreground px-4 md:px-1 text-sm sm:text-base tracking-wide leading-6 md:leading-7 text-center">
            Discover communities, join discussions, and connect with people who share your passions.
          </p>
          <Button
            variant="default"
            onClick={handleCreateCommunity}
            className="lg:hidden has-[>svg]:px-5 sm:has-[>svg]:px-7 py-5 rounded-xl text-white text-base font-normal cursor-pointer"
          >
            <Plus className="size-4 sm:size-5" /> Create Community
          </Button>
        </div>
      </div>
    </div>
  );
}
