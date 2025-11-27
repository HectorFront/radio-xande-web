import { AppRoutes } from './routes';
import { createRoot } from "react-dom/client";
import { NotificationsProvider as NotificationsReapopProvider } from 'reapop';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(
    <QueryClientProvider client={queryClient}>
        <NotificationsReapopProvider>
            <AppRoutes />
        </NotificationsReapopProvider>
    </QueryClientProvider>
);