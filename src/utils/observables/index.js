/**
 * @author Hector Rodrigues da Silva
 */

export let _observers = [];

export class ObservableGlobal {

    /**
     *
     * @returns {*[]}
     */
    static unsubscribeAll() {
        console.log('[~Clear] => All observable');
        return _observers = [];
    }

    /**
     * 
     * @param {*} idListener 
     * @param {*} fn 
     * @returns 
     */
    static unsubscribe(idListener, fn) {
        console.log(`[~Clear] => Observer: ${idListener}`);
        return _observers = _observers.filter(item => !(item.observer.idListener === idListener && item.observer.fnListener === fn));
    }

    /**
     *
     * @param idListener
     * @param data
     */
    static notify(idListener, data) {
        _observers.forEach(({observer}) => {
            if(observer.idListener === idListener) {
                observer.fnListener(data);
            }
        });
    }

    /**
     *
     * @param idListener
     * @param fnListener
     * @returns {*[]}
     */
    static subscribe(idListener, fnListener) {
        console.log(`[~Subscribe] => ID: ${idListener}`);
        _observers.push({observer: {idListener, fnListener}});
    }
}