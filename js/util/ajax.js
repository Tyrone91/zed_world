function ajaxBase(method, url, data){
    const accepts = [200,201]; //TODO: refactor to option.    
    return new Promise( (resolve, reject) =>{
        const xhttp = new XMLHttpRequest();
        xhttp.overrideMimeType("text/json"); //TODO: make this an option
        xhttp.addEventListener("load", function(){
            console.log(xhttp);
            if( accepts.find( n => n === xhttp.status) ){
                console.log("mhhhh");
                resolve(xhttp);
            }else{
                console.log("ehm");
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
            console.log("hallo?");
            resolve(JSON.parse(xhttp.responseText));
        }, (xhttp) => {
            reject(xhttp);
        });
    });
}

/**
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