import { notify } from "../notify.js";
import { getUserData } from "../util.js";

const host = 'https://parseapi.back4app.com';
const appId = 'zq7tnW1YUJD1pIGXepojhqncmbFaZHDxRptZMJ2L';
const apiKey = 'UiC7vBTIOEkrxpCU4Ww40VT6BmWhxS0U1eciRTwm';

async function request(method, url = '/', data){
    const options = {
        method,
        headers: {
            'X-Parse-Application-Id': appId,
            'X-Parse-JavaScript-Key' : apiKey
        }
    };

    if(data !== undefined){
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const userData = getUserData();
    if(userData){
        options.headers['X-Parse-Session-Token'] = userData.sessionToken;
    }

    try {
        
        const responce = await fetch(host + url, options);

        if(responce.status == 204){
            return responce;
        }

        const result = await responce.json();

        if(responce.ok != true){
            throw new Error(result.message || result.error);
        }

        return result;

    } catch (err) {
        notify (err.message);
        throw err;
    }
}

export const get = request.bind(null, 'get');
export const post = request.bind(null, 'post');
export const put = request.bind(null, 'put');
export const del = request.bind(null, 'delete');