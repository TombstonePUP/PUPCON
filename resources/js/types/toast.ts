export interface NotificationContent {
    type: string;
    title: string;
    message: string;
}

export interface NotifProps {
    flash?: NotificationContent;
}
