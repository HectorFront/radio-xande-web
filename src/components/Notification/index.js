let NotificationManager = {
    notify: null,
    dismissNotification: null
};
export const setNotificationApp = notification => {
    NotificationManager = notification;
};
export class Alert {

    static defaultTime = 3000;

    /**
     *
     * @param notify
     */
    static create(notify) {
        const defaultNotify = {
            status: 'info',
            title: null,
            message: null,
            allowHTML: true,
            dismissible: true,
            dismissAfter: this.defaultTime
        };
        NotificationManager.notify(Object.assign(defaultNotify, notify));
    }

    /**
     *
     * @param title
     * @param message
     */
    static success(title = '', message = '') {
        Alert.create({ status: 'success', message, title });
    }

    /**
     *
     * @param title
     * @param message
     */
    static info(title = '', message = '') {
        Alert.create({ status: 'info', message, title });
    }

    /**
     *
     * @param title
     * @param message
     */
    static warning(title = '', message = '') {
        Alert.create({ status: 'warning', message, title });
    }

    /**
     *
     * @param title
     * @param message
     */
    static error(title = '', message = '') {
        Alert.create({ status: 'error', message, title });
    }

    static clear() {
        NotificationManager.dismissNotification();
    }
}