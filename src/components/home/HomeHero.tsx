import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

type HomeHeroProps = {
  isLoading?: boolean;
  onClick: () => void;
};

export function HomeHero({ onClick }: HomeHeroProps) {
  return (
    <>
      <div className="relative w-full xl:h-110 mt-18 py-6 px-2 md:px-25">
        <div className="w-full relative z-1 flex flex-col-reverse md:flex-row justify-around items-center">
          {/* Content */}
          <div className="flex flex-col items-center text-center md:text-start md:items-start gap-4 max-w-xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-bold leading-tight md:leading-11.25 text-gradient">
              LeTopia
            </h2>
            <span className="text-base sm:text-lg font-bold text-gradient capitalize tracking-wider">
              {' '}
              where anyone can learn anything{' '}
            </span>
            <p className="text-brand-800 px-4 md:px-1  text-sm sm:text-base tracking-wide leading-7">
              Discover communities, join discussions, and connect with people who share your
              passions.
            </p>
            <button
              onClick={onClick}
              className="flex items-center gap-2 px-6 sm:px-8 py-2 mt-4 rounded-full font-medium bg-white shadow-xl transition-shadow hover:translate-y-1 hover:cursor-pointer transition-all duration-300"
            >
              <span className="text-sm sm:text-base text-gradient capitalize tracking-wider font-semibold">
                get started free
              </span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                strokeWidth={2.5}
                className="text-primary/90"
              />
            </button>
          </div>

          {/* Illustration */}
          <div className="relative w-40 md:w-65 lg:w-70 aspect-square">
            <img src="/assets/home-illustration.svg" alt="Hero illustration" className="" />
          </div>
        </div>
      </div>
    </>
  );
}
