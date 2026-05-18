import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface MemberAvatarProps {
  avatarUrl?: string | null;
  fullName: string;
  size?: 'sm' | 'default' | 'lg';
}

export function MemberAvatar({ avatarUrl, fullName, size = 'lg' }: MemberAvatarProps) {
  return (
    <Avatar size={size}>
      <AvatarImage src={avatarUrl ?? undefined} alt={fullName} />
      <AvatarFallback className="bg-white text-[#824892] font-semibold uppercase">
        {fullName?.charAt(0) ?? '?'}
      </AvatarFallback>
    </Avatar>
  );
}
