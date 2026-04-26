import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ConfirmationState {
  show: boolean;
  communitySlug?: string;
  communityName?: string;
}

interface UseConfirmationDialogReturn {
  confirmation: ConfirmationState;
  showConfirmation: (slug: string, name: string) => void;
  closeConfirmation: () => void;
  navigateToCommunity: () => void;
}

export function useConfirmationDialog(): UseConfirmationDialogReturn {
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    show: false,
  });

  const showConfirmation = useCallback((slug: string, name: string) => {
    setConfirmation({
      show: true,
      communitySlug: slug,
      communityName: name,
    });
  }, []);

  const closeConfirmation = useCallback(() => {
    setConfirmation({
      show: false,
    });
  }, []);

  const navigateToCommunity = useCallback(() => {
    if (confirmation.communitySlug) {
      navigate(`/communities/${confirmation.communitySlug}`);
    }
  }, [confirmation.communitySlug, navigate]);

  return {
    confirmation,
    showConfirmation,
    closeConfirmation,
    navigateToCommunity,
  };
}
