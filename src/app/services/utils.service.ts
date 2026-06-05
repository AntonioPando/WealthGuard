import {HttpHeaders, HttpParams} from "@angular/common/http";

export default async function to(promise: Promise<any>) {
    try {
        const data = await promise
        return data
    } catch (err) {
        return [err]
    }
}

export function isOkResponse(response: any) {
    if (!response) return false;
    // If `to()` returned an error array, treat as failed
    if (Array.isArray(response)) return false;
    // If response is an HttpResponse with status code
    if (response.status && response.status >= 200 && response.status < 300) return true;
    // Backwards-compatible: check wrapped response body with type === 'OK'
    if (response.body && response.body.type === 'OK') return true;
    return false;
}

export function loadResponseData(response: any) {
    if (!response) return null;
    if (response.body && response.body.data !== undefined) return response.body.data;
    if (response.body !== undefined) return response.body;
    return response;
}

export function loadResponseError(response: { body: { exception: { codigoDeError: string; mensajeDeError: string; }; }; }) {
    if (!response || !response.body || !response.body.exception) {
        return "Error inesperado de servidor";
    } else {
        return response.body.exception.codigoDeError + ' ' + response.body.exception.mensajeDeError;
    }
}

export const headers = new HttpHeaders({
    'Content-Type': 'application/json'
});

