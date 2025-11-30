import { AsyncStorage } from "@/utils";
import { createContext, useEffect, useState } from "react";

interface UserProps {
    name?: string | null;
    email?: string | null;
    is_dev?: boolean;
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
    latest_login?: string | null;
    access_token?: string | null;
    refresh_token?:  string | null;
}

const INITIAL_STATE_USER: UserProps = {
    name: null,
    email: null,
    is_dev: false,
    is_superxandao: false,
    is_admin: false,
    is_moderator: false,
    picture: null,
    is_banned: false,
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
    latest_login: null,
    access_token: null,
    refresh_token: null
};

interface ContextProps {
    user: UserProps;
    authentication: AuthenticationProps;
    authenticated: boolean;
    setUser: (user: UserProps) => void;
    setAuthentication: (authentication: AuthenticationProps) => void;
    setKeyAuthentication: (key: string, value: any) => void;
    setKeyUser: (key: string, value: any) => void;
    logoutUser: () => void;
}

export const ContextAuthentication = createContext<ContextProps>({
    user: INITIAL_STATE_USER,
    authentication: INITIAL_STATE_AUTHENTICATION,
    authenticated: false,
    setUser: (user: typeof INITIAL_STATE_USER) => {},
    setAuthentication: (authentication: typeof INITIAL_STATE_AUTHENTICATION) => {},
    setKeyAuthentication: (key: string, value: any) => {},
    setKeyUser: (key: string, value: any) => {},
    logoutUser: () => {}
});

export const AuthenticationProvider = ({ children }) => {

    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<UserProps>(INITIAL_STATE_USER);
    const [authentication, setAuthentication] = useState<AuthenticationProps>(INITIAL_STATE_AUTHENTICATION);

    const handleAuthentication = (payload : AuthenticationProps = {}) => {
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
        setAuthentication(current => ({...current, ...payload }));
    };

    const handleUser = (payload = {}) => {
        setUser(current => ({...current, ...payload }));
    };

    const setKeyAuthentication = (key: string, value: any) => {
        if (key === "access_token") {
            AsyncStorage.set(import.meta.env.VITE_USER_TOKEN_STORAGE, value);
        }
        if (key === "refresh_token") {
            AsyncStorage.set(import.meta.env.VITE_USER_REFRESH_TOKEN_STORAGE, value);
        }
        setAuthentication(current => ({...current, [key]: value }));
    };

    const setKeyUser = (key: string, value: any) => {
        setUser(current => ({...current, [key]: value }));
    };

    const logoutUser = () => {
        // request logou
        setAuthenticated(false);
        setUser(INITIAL_STATE_USER);
        setAuthentication(INITIAL_STATE_AUTHENTICATION);
        AsyncStorage.clear();
    };

    useEffect(() => {
        console.log(authentication);
    }, [authentication]);
    
    return (
        <ContextAuthentication.Provider value={{
            user,
            authentication,
            authenticated,
            setUser: handleUser,
            setAuthentication: handleAuthentication,
            setKeyAuthentication,
            setKeyUser,
            logoutUser
        }}>
            {children}
        </ContextAuthentication.Provider>
    );
}