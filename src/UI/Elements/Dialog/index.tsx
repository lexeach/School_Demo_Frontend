import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import React from 'react';
import UIButton from '../Button';
import { BellAlertIcon } from '@heroicons/react/24/outline';

interface UIDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  header?: string;
  description?: string | React.ReactNode | CustomDescriptionType;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  customClass?: string;
  showFooter?: boolean;
  customButtons?: React.ReactNode;
  headerClassName?: string;
  alertIcon?: boolean;
}

interface CustomDescriptionType {
  heading: string;
  items: string[];
}

const UIDialog: React.FC<UIDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  header,
  description,
  children,
  confirmText = 'confirm',
  cancelText = 'cancel',
  customClass,
  showFooter = true,
  customButtons,
  headerClassName = '',
  alertIcon = false,
}) => {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`w-full flex flex-col ${customClass} `}>
        {header && (
          <DialogHeader>
            <DialogTitle className={`${headerClassName}`}>
              {alertIcon && <BellAlertIcon className={`mr-2`} width={20} />}
              {header}
            </DialogTitle>

            {description && (
              <DialogDescription>
                {React.isValidElement(description) ? (
                  description
                ) : typeof description === 'string' ? (
                  <span>{description}</span>
                ) : (
                  <CustomDescription description={description} />
                )}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="flex-1">{children}</div>
        {showFooter && (
          <DialogFooter className={`mt-4 rtl:flex-row-reverse}`}>
            {customButtons ? (
              customButtons
            ) : (
              <>
                <UIButton
                  variant="outline"
                  className="rtl:ml-4"
                  onClick={onClose}
                >
                  {(cancelText) || ('cancel')}
                </UIButton>
                <UIButton
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={onConfirm}
                >
                  {(confirmText) || ('confirm')}
                </UIButton>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface CustomDescriptionProps {
  description: CustomDescriptionType;
}

const CustomDescription: React.FC<CustomDescriptionProps> = ({
  description,
}) => {
  return (
    <div>
      <p className={`text-md font-medium rtl:text-right`}>
        {description.heading}
      </p>
      <ol className={`list-decimal mx-6`}>
        {description.items.map((item, index) => (
          <li className={`rtl:text-right`} key={index}>
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default UIDialog;
