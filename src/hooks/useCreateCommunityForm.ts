import type { CreateCommunityFormData } from '@/lib/validators';
import type { UseFormReset } from 'react-hook-form';
import { useCreateCommunity } from './useCommunities';
import { useCallback } from 'react';
import { mapFormDataToRequest } from '@/lib/community-form-utils';
import type { ApiResponse } from '@/types/api.types';
import type { CommunityDetail } from '@/types/community.types';

interface UseCreateCommunityFormProps {
  reset: UseFormReset<CreateCommunityFormData>;
  onSuccess: (slug: string, name: string) => void;
}

interface UseCreateCommunityFormReturn {
  onSubmit: (data: CreateCommunityFormData) => void;
  isPending: boolean;
}

export function useCreateCommunityForm({
  reset,
  onSuccess,
}: UseCreateCommunityFormProps): UseCreateCommunityFormReturn {
  const { mutate: createCommunity, isPending } = useCreateCommunity();

  const onSubmit = useCallback(
    (data: CreateCommunityFormData) => {
      const request = mapFormDataToRequest(data);
      createCommunity(request, {
        onSuccess: (response: ApiResponse<CommunityDetail>) => {
          const communityData = response.data;
          if (communityData?.slug && communityData?.name) {
            onSuccess(communityData.slug, communityData.name);
            reset();
          }
        },
      });
    },
    [createCommunity, reset, onSuccess]
  );
  return {
    onSubmit,
    isPending,
  };
}
