import {JWTEncode, JWTDecode } from "@/services";
/**
 * @author Hector Rodrigues da Silva
 * @class AsyncStorage
 */
export class AsyncStorage {

    /**
     * set in model
     *
     * @param {String} key
     * @param {*} value
     */
    static set(key, value) {
        localStorage.setItem(JWTEncode(key), JWTEncode(encodeURIComponent(value)));
    }

    /**
     * get in model
     *
     * @param {String} key
     * @returns {*} Value
     */
    static get(key) {
        const values = localStorage.getItem(JWTEncode(key));
        return values ? decodeURIComponent(JWTDecode(values)) : values;
    }

    /**
     * set object in model
     *
     * @param {String} key
     * @param {Object} value
     */
    static setObject(key, value) {
        localStorage.setItem(JWTEncode(key), JWTEncode(encodeURIComponent(JSON.stringify(value))));
    }

    /**
     * get object in model
     *
     * @param {String} key
     * @returns {Object} value
     */
    static getObject(key) {
        const values = localStorage.getItem(JWTEncode(key));
        return values ? JSON.parse(decodeURIComponent(JWTDecode(values))) : values;
    }

    /**
     * remove item do model
     *
     * @param {String} key
     */
    static removeItem(key) {
        localStorage.removeItem(JWTEncode(key));
    }

    /**
     * Clear model
     */
    static clear() {
        localStorage.clear();
    }
}