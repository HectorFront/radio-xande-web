import {ConstructorRequest} from '@/http/request';

export class RequestKickTVStreamGetStatus extends ConstructorRequest {

    constructor() {
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        super('superxandao', headers, 'GET', null, "https://kick.com/api/v2/channels");
    }
}