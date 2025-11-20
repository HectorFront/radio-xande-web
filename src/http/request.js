export class ConstructorRequest {
    /**
     *
     * @param url
     * @param headers
     * @param method
     * @param payload
     * @param externalOrigin
     */
    constructor(url = null, headers = null, method = null, payload = {}, externalOrigin = null) {
        this._url = url;
        this._headers = headers;
        this._method = method;
        this._payload = payload;
        this._externalOrigin = externalOrigin;
    }

    /**
     *
     * @returns {*}
     */
    get url() {
        return this._url;
    }

    /**
     *
     * @returns {*}
     */
    get headers() {
        return this._headers;
    }

    /**
     *
     * @returns {*}
     */
    get method() {
        return this._method;
    }

    /**
     *
     * @returns {*}
     */
    get payload() {
        return this._payload;
    }

    /**
     *
     * @returns {*}
     */
    get externalOrigin() {
        return this._externalOrigin;
    }
}