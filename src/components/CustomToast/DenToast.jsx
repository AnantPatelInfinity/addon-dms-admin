import { toast } from 'react-toastify';
import CustomToast from './CustomToast';


const showCustomToast = (message, type = 'info') => {
    return toast(
        ({ closeToast }) => (
            <CustomToast
                message={message}
                type={type}
                onClose={closeToast}
            />
        ),
        {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            closeButton: false,
            newestOnTop: true,
            bodyClassName: 'custom-toast-body',
            className: 'hide-default-toast',
        }
    );
};

export const toastSuccess = (message) => showCustomToast(message, 'success');
export const toastError = (message) => showCustomToast(message, 'error');
export const toastInfo = (message) => showCustomToast(message, 'info');
export const toastWarning = (message) => showCustomToast(message, 'warning');