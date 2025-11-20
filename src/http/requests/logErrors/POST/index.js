import {ConstructorRequest} from '@/http/request';
import {API_ROUTES} from '@/domain/api/routes';

export class RequestLogErrors extends ConstructorRequest {
    /**
     *
     * @param body
     */
    constructor(body) {
        const url = API_ROUTES.logErrors;
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        super(url, headers, 'POST', body);
    }
}