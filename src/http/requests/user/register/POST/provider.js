import {ConstructorRequest} from '@/http/request';
import {API_ROUTES} from '@/domain/api/routes';

export class RequestOAuthRegister extends ConstructorRequest {
    /**
     * 
     * @param {*} body 
     * @param {*} provider 
     */
    constructor(body, provider) {
        const url = `${API_ROUTES.oauth}/register/${provider}`;
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        super(url, headers, 'POST', body);
    }
}