import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UIAvatar({ className = '' }) {
  return (
    <Avatar className={className}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
