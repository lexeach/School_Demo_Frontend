import React from 'react';
import UIButton from '../Elements/Button';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface FixedButtonsProps {
  handlePrev?: () => void;
  handleNext?: () => void;
  nextLabel: string;
  prevLabel: string;
  customStyle?: {};
  CustomComponent?: React.FC;
}

const buttonsComponent = ({
  handleNext,
  handlePrev,
  nextLabel = 'save',
  disabled = 'false',
  prevLabel = 'cancel',
  className = '',
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`flex items-center justify-between space-x-2 px-6 py-4 layout-container ${className}`}
      dir="ltr"
    >
      <UIButton onClick={handlePrev} iconClassName="mr-1" variant="outline">
        {t(prevLabel)}
      </UIButton>
      <UIButton
        className="stroke-white"
        type="submit"
        iconClassName="stroke-cyan-500 ml-1"
        onClick={handleNext}
        disabled={disabled}
        iconPosition="after"
      >
        {t(nextLabel)}
      </UIButton>
    </div>
  );
};

const FixedButtons: React.FC<FixedButtonsProps> = ({
  handlePrev,
  handleNext,
  nextLabel = 'save',
  prevLabel = 'cancel',
  CustomComponent = buttonsComponent,
  disabled = false,
  customStyle = {},
}) => {
  const { language, sidebar } = useSelector(state => state.layout);
  const isSidebar = sidebar;
  return (
    <>
      <footer
        className={`absolute fixed-form-button bottom-0 left-0 right-0 bg-white border-t  border-gray-300 `}
        style={
          language === 'en'
            ? {}
            : {
                marginRight: isSidebar ? '250px' : '0px',
                width: `calc(100% - ${isSidebar ? '250px' : '0px'})`,
                ...customStyle,
              }
        }
      >
        <CustomComponent
          handlePrev={handlePrev}
          nextLabel={nextLabel}
          prevLabel={prevLabel}
          disabled={disabled}
          handleNext={handleNext}
        />
      </footer>
    </>
  );
};

export default FixedButtons;
