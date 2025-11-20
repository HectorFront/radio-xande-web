import {ConstructorRequest} from '@/http/request';
import {API_ROUTES} from '@/domain/api/routes';

export class RequestGetUniquePostMusic extends ConstructorRequest {
    /**
     *
     * @param id
     */
    constructor(id) {
        const url = `${API_ROUTES.music}/${id}`;
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        super(url, headers, 'GET', null);
    }
}