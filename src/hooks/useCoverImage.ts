import type { CreateCommunityFormData } from '@/lib/validators';
import { useCallback, useRef, useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

interface UseCoverImageReturn {
  coverImageInputRef: React.RefObject<HTMLInputElement | null>;
  uploadCoverImage: boolean;
  coverImagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearCoverImage: () => void;
}

interface UseCoverImageProps {
  setValue: UseFormSetValue<CreateCommunityFormData>;
}

export function useCoverImage({ setValue }: UseCoverImageProps): UseCoverImageReturn {
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadCoverImage, setUploadCoverImage] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        setValue('coverImage', undefined);
        setCoverImagePreview(null);
        return;
      }
      setUploadCoverImage(true);
      setValue('coverImage', file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
        setUploadCoverImage(false);
      };
      reader.readAsDataURL(file);
    },
    [setValue]
  );
  const clearCoverImage = useCallback(() => {
    setCoverImagePreview(null);
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = '';
    }
  }, []);

  return {
    coverImageInputRef,
    uploadCoverImage,
    coverImagePreview,
    handleImageChange,
    clearCoverImage,
  };
}
