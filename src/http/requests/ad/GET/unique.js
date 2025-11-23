import {ConstructorRequest} from '@/http/request';
import {API_ROUTES} from '@/domain/api/routes';

export class RequestGetUniqueAd extends ConstructorRequest {

    constructor() {
        const url = API_ROUTES.ad;
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        super(url, headers, 'GET', null);
    }
}