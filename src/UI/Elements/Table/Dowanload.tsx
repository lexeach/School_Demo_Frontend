// src/components/UIPagination.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import * as React from 'react';
import UIButton from '../Button';
import { EllipsisVerticalIcon } from 'lucide-react';

interface DownloadProps {
  name: string;
  onClick: (id: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const Download: React.FC<DownloadProps> = ({onClick = () => {}, name=''}) => {
  return (
    <UIButton
      variant="link"
      className="rounded-full ml-1 text-black stroke-black"
      size="xs"
    >
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVerticalIcon className="h-5 w-5 text-black" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Action Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onClick()}>{name}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </UIButton>
  );
};

export default Download;
