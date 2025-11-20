import { AppRoutes } from './routes';
import { createRoot } from "react-dom/client";
import { NotificationsProvider as NotificationsReapopProvider } from 'reapop';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(
    <NotificationsReapopProvider>
      <AppRoutes />
    </NotificationsReapopProvider>
);