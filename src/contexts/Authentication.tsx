import { Alert } from "@/components";
import { ExecutorRequest } from "@/http/executor";
import { RequestGetUserAuthenticated } from "@/http/requests/user";
import { AsyncStorage } from "@/utils";
import { createContext, useEffect, useState } from "react";

interface UserProps {
    id?: string;
    name?: string | null;
    username?: string | null;
    email?: string | null;
    is_dev?: boolean;
    is_artist?: boolean;
    is_superxandao?: boolean;
    is_admin?: boolean;
    is_moderator?: boolean;
    picture?: string | null;
    is_banned?: boolean;
    banned_until_date?: string | null;
    plan?: string | null;
    customer?: string | null;
    subscription?: string | null;
    payment_method?: string | null;
    plan_period?: string | null;
    date_subscription?: string | null;
    date_period_end_subscription?: string | null;
    provider_subscription?: string | null;
    date_created?: string | null;
}

interface AuthenticationProps {
    access_token?: string | null;
    email?: string | null;
    latest_login?: string | null;
    logged?: boolean;
    refresh_token?:  string | null;
}

const INITIAL_STATE_USER: UserProps = {
    name: null,
    username: null,
    email: null,
    is_dev: false,
    is_superxandao: false,
    is_admin: false,
    is_artist: false,
    is_moderator: false,
    is_banned: false,
    picture: null,
    banned_until_date: null,
    plan: "free",
    customer: null,
    subscription: null,
    payment_method: null,
    plan_period: null,
    date_subscription: null,
    date_period_end_subscription: null,
    provider_subscription: null,
    date_created: null,
};

const INITIAL_STATE_AUTHENTICATION: AuthenticationProps = {
    access_token: null,
    email: null,
    latest_login: null,
    logged: false,
    refresh_token: null
};

interface ContextProps {
    user: UserProps;
    authentication: AuthenticationProps;
    authenticated: boolean;
    loadingAuth: boolean;
    setUser: (user: UserProps) => void;
    setAuthentication: (authentication: AuthenticationProps) => void;
    logoutAuthentication: () => void;
}

export const ContextAuthentication = createContext<ContextProps>({
    user: INITIAL_STATE_USER,
    authentication: INITIAL_STATE_AUTHENTICATION,
    authenticated: false,
    loadingAuth: true,
    setUser: (user: typeof INITIAL_STATE_USER) => {},
    setAuthentication: (authentication: typeof INITIAL_STATE_AUTHENTICATION) => {},
    logoutAuthentication: () => {}
});

export const AuthenticationProvider = ({ children }) => {

    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const [accessToken, setAccessToken] = useState(AsyncStorage.get(import.meta.env.VITE_USER_TOKEN_STORAGE) || null);
    const [refreshToken, setRefreshToken] = useState(AsyncStorage.get(import.meta.env.VITE_USER_REFRESH_TOKEN_STORAGE) || null);

    const [user, setUser] = useState<UserProps>(AsyncStorage.getObject(import.meta.env.VITE_USER_STORAGE) || INITIAL_STATE_USER);
    const [authentication, setAuthentication] = useState<AuthenticationProps>(AsyncStorage.getObject(import.meta.env.VITE_AUTHENTICATION_STORAGE) || INITIAL_STATE_AUTHENTICATION);

    const handleAuthentication = (payload: AuthenticationProps = {}) => {
        if (payload.hasOwnProperty("access_token") || payload.hasOwnProperty("refresh_token")) {
            if (payload?.access_token || payload?.refresh_token) {
                setAuthenticated(true);
            }
            if (payload.hasOwnProperty("access_token")) {
                AsyncStorage.set(import.meta.env.VITE_USER_TOKEN_STORAGE, payload?.access_token);
            }
            if (payload.hasOwnProperty("refresh_token")) {
                AsyncStorage.set(import.meta.env.VITE_USER_REFRESH_TOKEN_STORAGE, payload?.refresh_token);
            }
        }
        setAuthentication(current => {
            const currentAuthentication = {...current, ...payload };
            AsyncStorage.setObject(import.meta.env.VITE_AUTHENTICATION_STORAGE, currentAuthentication);
            return currentAuthentication;
        });
    };

    const handleUser = (payload = {}) => {
        setUser(current => {
            const currentUser = {...current, ...payload };
            AsyncStorage.set(import.meta.env.VITE_USER_AGENT, navigator.userAgent);
            AsyncStorage.setObject(import.meta.env.VITE_USER_STORAGE, currentUser);
            return currentUser;
        });
    };

    const clearAuthentication = () => {
        // authentication
        AsyncStorage.removeItem(import.meta.env.VITE_AUTH_ACCESS_TOKEN_STORAGE);
        AsyncStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_STORAGE);
        AsyncStorage.removeItem(import.meta.env.VITE_AUTHENTICATION_STORAGE);
        // user
        AsyncStorage.removeItem(import.meta.env.VITE_USER_AGENT);
        AsyncStorage.removeItem(import.meta.env.VITE_USER_STORAGE);
        AsyncStorage.removeItem(import.meta.env.VITE_USER_TOKEN_STORAGE);
        AsyncStorage.removeItem(import.meta.env.VITE_USER_REFRESH_TOKEN_STORAGE);
        setAuthenticated(false);
        setAccessToken(null);
        setRefreshToken(null);
        setUser(INITIAL_STATE_USER);
        setAuthentication(INITIAL_STATE_AUTHENTICATION);
    };

    const logoutAuthentication = () => {
        // request logout
        clearAuthentication();
    };

    const verifyHasAuthentication = () => {
        const userAgentNavigator = navigator.userAgent;
        const userAgentLocalStorage = AsyncStorage.get(import.meta.env.VITE_USER_AGENT);
        if(userAgentNavigator !== userAgentLocalStorage) {
            setLoadingAuth(false);
            return clearAuthentication();
        }
        ExecutorRequest(new RequestGetUserAuthenticated())
            .then((payload: UserProps) => {
                setAuthenticated(true);
                handleUser(payload);
            })
            .catch(err => {
                if (!err?.status) {
                    Alert.error("Servidor indisponível", "Tente novamente mais tarde.")
                }
                if (err?.status === 401) {
                    clearAuthentication();
                }
            }).finally(() => setLoadingAuth(false));
    }

    useEffect(() => {
        if (accessToken || refreshToken) {
            verifyHasAuthentication();
        } else {
            setLoadingAuth(false);
            clearAuthentication();
        }
    }, []);
    
    return (
        <ContextAuthentication.Provider value={{
            user,
            authentication,
            authenticated,
            loadingAuth,
            setUser: handleUser,
            setAuthentication: handleAuthentication,
            logoutAuthentication
        }}>
            {children}
        </ContextAuthentication.Provider>
    );
}