import { AsyncStorage } from "@/utils";
import { RequestLogErrors } from "@/http/requests/logErrors";

const registerErrorLog = async (log, options) => {
    const payload = {
        url: log.url,
        status_code: log.status,
        status_text: log.statusText,
        options: JSON.stringify(options),
        error: log.error || "UNAVAILABLE"
    };
    await ExecutorRequest(new RequestLogErrors(payload))
};

export const ExecutorRequest = async Request => {
    const token = AsyncStorage.get(import.meta.env.VITE_USER_TOKEN_STORAGE) || AsyncStorage.get(import.meta.env.VITE_AUTH_TOKEN_STORAGE);
    if (!Request.externalOrigin) {
        token && Request.headers.append('Authorization', token);
        Request.headers.append('key-platform', import.meta.env.VITE_KEY_PLATFORM);
    }
    const options = Request.method.includes('GET')
        ? { headers: Request.headers }
        : {
            method: Request.method,
            headers: Request.headers,
            body: JSON.stringify(Request.payload)
        };
    const base = Request.externalOrigin || import.meta.env.VITE_API_BASE_URL;
    try {
        const response = await fetch(`${base}/${Request.url}`, options);
        const contentType = response.headers.get('content-type');
        if (!response.ok) {
            const objectResponse = {
                ok: response.ok,
                url: response.url,
                type: response.type,
                status: response.status,
                headers: response.headers,
                statusText: response.statusText,
                redirected: response.redirected
            };
            let error;
            if (response.status !== 404 && response.status !== 401) {
                if (contentType?.includes("application/json")) {
                    error = await response.json();
                    await registerErrorLog({ ...objectResponse, error: JSON.stringify(error) }, options);
                } else {
                    error = await response.text();
                    await registerErrorLog({ ...objectResponse, error }, options);
                }
            }
            throw { ...objectResponse, error };
        }
        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};