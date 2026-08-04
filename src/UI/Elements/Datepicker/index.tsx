'use client';

import * as React from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

function UIDatepicker({ label, error, isFutureDates, ...props }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      {label && (
        <p className="text-sm leading-5 font-medium pb-1">{t(label)}</p>
      )}
      <Popover open={open}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            onClick={() => setOpen(true)}
            className={cn(
              'w-full justify-start text-left font-normal',
              !props.value && 'text-muted-foreground',
              error && 'border border-red-300 text-red-900',
              'mx-0'
            )}
          >
            <CalendarIcon className="mr-2 rtl:ml-2 h-4 w-4" />
            {props.value ? (
              format(props.value, 'PPP')
            ) : (
              <span className="mx-3">{t(label)}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={props.value}
            onSelect={val => {
              setOpen(false);
              props.onChange(val);
            }}
            disabled={isFutureDates ? data => data < new Date() : false}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <>
          <p className="mt-1 text-gray-500 text-sm">{error.message}</p>
          <ExclamationCircleIcon
            width={20}
            height={20}
            className="text-red-500 absolute"
            style={{
              left: isRTL ? '5px' : '',
              right: isRTL ? '' : '5px',
              top: '33px',
            }}
          />
        </>
      )}
    </div>
  );
}

export default UIDatepicker;
