import {ConstructorRequest} from '@/http/request';

export class RequestGetUserAuthenticated extends ConstructorRequest {
    
    constructor() {
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        super('current', headers, 'GET', null);
    }
}