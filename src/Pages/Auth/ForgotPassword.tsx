import * as yup from 'yup';

import AuthWrapper from './Wrapper';
import DynamicForm from '@/UI/Form/DynamicForm';
import UIButton from '@/UI/Elements/Button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const fields = [
  {
    name: 'email',
    label: 'enter_email_address',
    placeholder: 'email',
    type: 'text',
    className: '',
    validation: yup.string().email('invalid_email').required('email_required'),
  },
];

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
};

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onSubmit = async () => {};

  const buttonConfig = {
    label: t('reset_password'),
    type: 'submit',
    className: 'w-full h-[50px] mt-2',
  };
  return (
    <AuthWrapper title={t('forgot_password')}>
      <DynamicForm<RegisterFormValues>
        fields={fields}
        onSubmit={onSubmit}
        buttonConfig={buttonConfig}
        loading={false}
      />
      <UIButton
        variant="link"
        size="xl"
        className="mt-5"
        onClick={() => {
          navigate('/auth/login');
        }}
      >
        {t('go_back')}
      </UIButton>
    </AuthWrapper>
  );
}
