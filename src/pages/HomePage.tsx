import { useNavigate } from 'react-router-dom';
import { StepsSection } from '@/components/home/StepsSection';
import { faqItems, features, steps } from '@/lib/constants';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { FAQSection } from '@/components/home/FaqSection';
import { CTASection } from '@/components/home/CtaSection';
import { HomeHero } from '@/components/home/HomeHero';
import { PopularCommunities } from '@/components/home/PopularCommunities';
import { useAuthContext } from '@/context/AuthContext';

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <h2>Home Page</h2>;
  }

  return (
    <main className="w-full relative overflow-hidden">
      {/* background */}
      <div className="fixed top-20 sm:top-24 xl:top-42 left-0 w-[500px] h-[500px] pointer-events-none z-0">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-primary to-[#4c88c1] blur-[120px] opacity-40" />
      </div>

      <div className="relative z-1 space-y-20 sm:space-y-24 lg:space-y-32">
        {/* Hero Section */}
        <HomeHero onClick={() => navigate('/register')} />

        {/* Features Section */}
        <FeaturesSection
          title="Everything you need, in one place."
          subtitle="Learn, build, and connect without bouncing between apps. LeTopia brings it all together."
          features={features}
        />

        {/* Communities Section */}
        <PopularCommunities title="Explore Popular Communities" limit={9} />

        {/* Steps Section */}
        <StepsSection headline="From curious to capable in three steps." steps={steps} />

        {/* FAQ Section */}
        <FAQSection
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about getting started with LeTopia"
          items={faqItems}
        />

        {/* CTA Section */}
        <CTASection
          headline="Unlock your potential with LeTopia."
          description="Join thousands of makers, learners, and builders shaping their future — together."
          primaryButtonLabel="Create your account"
          onPrimaryClick={() => navigate('/register')}
        />

        {/* Footer Section */}
      </div>
    </main>
  );
}
