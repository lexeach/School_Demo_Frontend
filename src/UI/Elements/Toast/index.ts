import { Bounce, toast } from 'react-toastify';

export const SuccessToaster = (value: string) => {
  toast.success(value, {
    position: 'bottom-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  });
};

export const ErrorToaster = (value: string) => {
  toast.error(value, {
    position: 'bottom-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  });
};
export const LoadingToaster = (value: string) => {
  const toastId = toast.loading(value, {
    position: 'bottom-right',
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  });
  return toastId;
};