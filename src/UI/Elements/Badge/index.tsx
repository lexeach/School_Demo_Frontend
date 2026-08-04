import { Badge } from '@/components/ui/badge';

interface BadgeProps {
  children: React.ReactNode;
  onClick?: () => void;
  colorStyle?:
    | 'default'
    | 'red'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'primary'
    | 'gray'
    | 'purple'
    | 'pink';
  size?: 'small' | 'large';
  className?: string;
}

const UIBadge: React.FC<BadgeProps> = ({
  onClick,
  children,
  colorStyle = 'default',
  size = 'small',
  className = '',
}) => {
  return (
    <>
      <Badge
        className={className}
        colorStyle={colorStyle}
        size={size}
        onClick={onClick}
      >
        {children}
      </Badge>
    </>
  );
};

export default UIBadge;
