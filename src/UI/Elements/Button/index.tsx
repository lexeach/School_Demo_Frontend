import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: (e) => void;
  className?: string;
  innerClassName?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'sky'
    | 'white'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
    | undefined;
  size?: 'default' | 'xs' | 'sm' | 'lg' | 'xl' | 'md';
  icon?: React.ReactNode;
  iconPosition?: 'after' | 'before';
  iconClassName?: string;
  round?: boolean;
  iconSize?: '"default" | "small" | "large" | null | undefined';
  roundedClass?: string;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  tooltipContent?: string; // Tooltip content as an optional prop
}

const UIButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  innerClassName = 'btn-xs',
  variant,
  className = '',
  size = 'default', // Providing a default value right here
  icon,
  iconPosition = 'before',
  iconClassName = '',
  round = false,
  roundedClass = '',
  type = 'button',
  disabled = false,
  tooltipContent, // Optional tooltip content
}) => {
  const renderContent = () => {
    if (!icon) {
      return children;
    }

    const iconElement = (
      <span className={`icon rtl:ml-2 ${iconClassName}`}>{icon}</span>
    );

    return (
      <>
        {iconPosition === 'before' && iconElement}
        {children}
        {iconPosition === 'after' && iconElement}
      </>
    );
  };

  const rounded = round
    ? ['xs', 'sm', 'md', 'lg', 'xl', 'default'].includes(size)
      ? size
      : 'default'
    : 'default';

  return tooltipContent ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          disabled={disabled}
          type={type}
          size={size}
          variant={variant}
          rounded={roundedClass !== '' ? roundedClass : rounded}
          className={`${innerClassName} ${className}`}
          onClick={onClick}
        >
          {renderContent()}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  ) : (
    <Button
      disabled={disabled}
      type={type}
      size={size}
      variant={variant}
      rounded={roundedClass !== '' ? roundedClass : rounded}
      className={`${innerClassName} ${className}`}
      onClick={onClick}
    >
      {renderContent()}
    </Button>
  );
};

export default UIButton;

