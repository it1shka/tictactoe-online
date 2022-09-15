export function find(query) {
    const element = document.querySelector(query);
    if (!element) {
        throw new Error(`Element "${query}" not found.`);
    }
    return element;
}
export const Second = 1000;
export function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
export async function showAlert(message) {
    const alertElement = document.createElement('aside');
    alertElement.classList.add('alert-window');
    alertElement.innerText = message !== null && message !== void 0 ? message : 'Warning!';
    document.body.appendChild(alertElement);
    await delay(10);
    alertElement.classList.toggle('opened');
    await delay(3 * Second);
    alertElement.classList.toggle('opened');
    await delay(2 * Second);
    alertElement.remove();
}
export function formatSeconds(seconds) {
    const min = ~~(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
export function websocketCloseReason(code) {
    switch (code) {
        case 1000: return "normal connection closure";
        case 1001: return "either server or client went away";
        case 1002: return "protocol error";
        case 1003: return "received illegal data type";
        case 1004: return "reserved: specific closure reason might be defined in future";
        case 1005: return "no status code was actually present";
        case 1006: return "connection was closed abnormally";
        case 1007: return "received non-consistent message";
        case 1008: return "received message that violates socket policy";
        case 1009: return "received too big message";
        case 1010: return "expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake";
        case 1011: return "server terminating WebSocket connection because it encountered an unexpected condition";
        case 1015: return "failure to perform a TLS handshake";
        default: return "unknown reason";
    }
}
