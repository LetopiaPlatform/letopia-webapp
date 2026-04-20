import { useParams } from 'react-router-dom';
import { useCommunityBySlug } from '@/hooks/useCommunities';

export function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useCommunityBySlug(slug!);
  const community = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading community...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Community not found.</p>
      </div>
    );
  }

  return (
    <div className="mt-20 px-5 md:px-8 2xl:px-15 py-8">
      <h1 className="text-2xl font-semibold">{community.name}</h1>
      <p className="text-muted-foreground mt-2">{community.description}</p>
    </div>
  );
}
