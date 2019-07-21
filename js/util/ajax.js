function ajaxBase(method, url, data){
    const accepts = [200,201]; //TODO: refactor to option.    
    return new Promise( (resolve, reject) =>{
        const xhttp = new XMLHttpRequest();
        xhttp.overrideMimeType("text/json"); //TODO: make this an option
        xhttp.addEventListener("load", function(){
            if( accepts.find( n => n === xhttp.status) ){
                resolve(xhttp);
            }else{
                reject(xhttp);
            }
            
        });
        xhttp.addEventListener("error", function(){
            reject(xhttp);
        });
        xhttp.open(method, url, true);
        xhttp.send(data);
    });
}

export function post(url, data){
    const p = ajaxBase("POST", url ,data);
    return new Promise( (resolve, reject) => {
        p.then( (xhttp) => {
            resolve(xhttp);
        }, (xhttp) => {
            reject(xhttp);
        });
    });
}

export function get(url,data){
    const p = ajaxBase("GET", url ,data);
    return new Promise( (resolve, reject) => {
        p.then( (xhttp) => {
            resolve(xhttp);
        }, (xhttp) => {
            reject(xhttp);
        });
    });
}

export function getJSON(url){
    const p = get(url);
    return new Promise((resolve, reject) => {
        p.then( (xhttp) => {
            resolve(JSON.parse(xhttp.responseText));
        }, (xhttp) => {
            reject(xhttp);
        });
    });
}

/**
 * Returns a list with the results of the given urls.
 * 
 * @template T
 * @param {string[]} urls 
 * @param {string=} basePath
 * @param {string=} suffix
 * @returns {Promise<{data: [T], missing: [string] }>}
 */
export function getJSONAll(urls, basePath = "", suffix = ""){
    return new Promise( (resolve, reject) => {

        const expectedEntries = urls.length;
        const res = [];
        const missing = [];

        const stateCheck = () => {
            if(res.length === (expectedEntries - missing.length)){
                resolve({data: res, missing: missing});
            }
        };

        const addM = url => {
            missing.push(url);
            stateCheck();
        };

        const add = data => {
            res.push(data);
            stateCheck();
        };
        
        urls.forEach(url => {
            getJSON(basePath+url+suffix).then( data => add(data), () => addM(url) );
        });

    });
}

export class ResponseWrapper {
    /**
     * 
     * @param {any} resp 
     */
    constructor(resp) {
        this._resp = resp;
        
        /**@type {string[]} */
        this._missing = [];
    }

    /**
     * 
     * @param {string} key 
     * @param {any} fallback 
     */
    _read(key, fallback) {
        if(this._resp[key]) {
            return this._resp[key];
        }
        this._missing.push(key);
        return fallback;
    }

    /**
     * 
     * @param {string} key 
     * @param {number} fallback
     * @returns {number}
     */
    readInt(key, fallback  = 0) {
        return Number.parseInt(this._read(key, fallback));
    }

    /**
     * 
     * @param {string} key 
     * @param {string} fallback 
     * @returns {string}
     */
    readText(key, fallback = "") {
        return this._read(key, fallback);
    }

    getMissing() {
        return this._missing;
    }
}
