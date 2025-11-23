/** @name Dependencies */
import {Suspense, lazy, useLayoutEffect} from 'react';
import {HashRouter, Routes, Route} from 'react-router-dom';
import NotificationsSystem, {bootstrapTheme, useNotifications, setUpNotifications} from 'reapop';
/** @name External */
import {App} from '@/layout';
import {PUBLIC_ROUTES} from '@/pages/paths';
import {Fallback, setNotificationApp} from '@/components';

const Home = lazy(() => import("@/pages/screens/Radio").then());

setUpNotifications({
    defaultProps: {
        allowHTML: true,
        dismissible: true,
        position: 'top-center',
        showDismissButton: true
    }
});

const SwitchRoutes = ({ children }) => (
    <Suspense fallback={<Fallback/>}>
        {children}
    </Suspense>
);

const RenderRoutes = ({routes}) => {
    return (
        <App>
            <Routes>
                {routes.map(({ path, component: Component },  i) =>
                    <Route exact key={i} path={path} element={<Component/>}/>
                )}
                <Route path="*" element={<Home/>}/>
            </Routes>
        </App>
    );
};

export const AppRoutes = () => {
    const loadingAuth = false;
    const {notifications, notify, dismissNotification} = useNotifications();
    useLayoutEffect(() => {
        setNotificationApp({ notify, dismissNotification });
    },[]);
    return (
        <>
            <HashRouter>
                <SwitchRoutes>
                    {loadingAuth
                        ?
                        <Fallback/>
                        :
                        <>
                            <RenderRoutes
                                authenticated={false}
                                routes={PUBLIC_ROUTES}
                            />
                            <NotificationsSystem
                                theme={bootstrapTheme}
                                notifications={notifications}
                                dismissNotification={(id) => dismissNotification(id)}
                            />
                        </>
                    }
                </SwitchRoutes>
            </HashRouter>
        </>
    )
}