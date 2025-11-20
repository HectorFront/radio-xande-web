import {ConstructorRequest} from '@/http/request';
import {API_ROUTES} from '@/domain/api/routes';

export class RequestGetPostMusic extends ConstructorRequest {
    
    constructor() {
        const url = API_ROUTES.music;
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        super(url, headers, 'GET', null);
    }
}