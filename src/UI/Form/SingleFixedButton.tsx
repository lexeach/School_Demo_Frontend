import UIButton from '../Elements/Button';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const SingleFixedButton = () => {
  const { t } = useTranslation();
  const sidebar = useSelector(item => item.layout.sidebar);

  return (
    <>
      <div
        className={`fixed bottom-0 w-full bg-white border-t border-gray-300 ${sidebar ? 'left-[250px]' : 'left-[110px]'}`}
      >
        <div className="flex items-center justify-end space-x-2 px-6 py-4 layout-container text-right pr-40">
          <UIButton
            className="stroke-white"
            type="submit"
            iconClassName="stroke-cyan-500 ml-1"
            iconPosition="after"
          >
            {t('submit')}
          </UIButton>
        </div>
      </div>
    </>
  );
};

export default SingleFixedButton;
