import {ConstructorRequest} from '@/http/request';
import {API_ROUTES} from '@/domain/api/routes';

export class RequestYouTubeStreamGetUnique extends ConstructorRequest {
    /**
     *
     * @param idChannel
     */
    constructor(idChannel) {
        const url = `${API_ROUTES.youtube}/live/${idChannel}`;
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        super(url, headers, 'GET', null);
    }
}