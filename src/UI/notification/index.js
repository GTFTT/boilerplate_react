//vendor
import { message, notification } from 'antd';


/**
 * Created for handling popup message styles and to fix z-index bug
 * @param {*} type  one of error, waning, success, info
 * @param {*} message 
 * @param {*} title 
 * @param {*} options notification interface options, used to customize notification
 */
 const showNotification = (type, message, title, options = {}) => {
    const notificationObject = {
        title: title,
        message: message,
        className: 'custom-notification',
        placement: 'bottomRight',
        style: {
            width: '50vw',
            borderRadius: '0.5em',
            borderTopLeftRadius: '2em',
            borderBottomLeftRadius: '1em',
        },
        ...options
    };

    switch (type) {
        case 'info':
            notification.info(notificationObject);
            break;
        case 'error':
            notification.error(notificationObject);
            break;
        case 'warning':
            notification.warning(notificationObject);
            break;
        case 'success':
            notification.success(notificationObject);
            break;
    
        default:
            break;
    }
}

const showInfo = (message, title, options) => {
    showNotification('info', message, title, options);
}

const showWarning = (message, title, options) => {
    showNotification('warning', message, title, options);
}

const showError = (message, title, options) => {
    showNotification('error', message, title, options);
}

const showSuccess = (message, title, options) => {
    showNotification('success', message, title, options);
}

export {
    showInfo,
    showWarning,
    showError,
    showSuccess
};
