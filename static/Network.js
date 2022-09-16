import { delay, Second, showAlert, websocketCloseReason } from './misc.js';
class Network {
    constructor(url) {
        this.url = url;
        this.reconnectSeconds = 10;
        this.handlers = {};
        this.eventHandlers = {};
        this.ws = null;
        this.onopen = (ev) => {
            var _a;
            console.log(`Established connection to ${this.url}.`);
            showAlert('Established WebSocket connection!');
            (_a = this.eventHandlers.open) === null || _a === void 0 ? void 0 : _a.apply(null, [ev]);
        };
        this.onmessage = (ev) => {
            var _a;
            try {
                const message = JSON.parse(ev.data);
                const messageType = message['messageType'];
                const handler = this.handlers[messageType];
                if (handler)
                    handler(message);
            }
            catch (error) {
                console.log(`Unknown message: ${ev.data}`);
                showAlert('Error: WebSocket got unknown message');
            }
            finally {
                (_a = this.eventHandlers.message) === null || _a === void 0 ? void 0 : _a.apply(null, [ev]);
            }
        };
        this.onerror = (ev) => {
            var _a;
            console.error('WebSocket error');
            showAlert('WebSocket error occured.');
            (_a = this.eventHandlers.error) === null || _a === void 0 ? void 0 : _a.apply(null, [ev]);
        };
        this.onclose = async (ev) => {
            var _a, _b;
            (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
            this.ws = null;
            const code = ev.code;
            const reason = websocketCloseReason(code);
            console.error(`WebSocket closed due to reason: ${reason}.`);
            showAlert(`WebSocket closed. Reconnecting in ${this.reconnectSeconds} seconds...`);
            (_b = this.eventHandlers.close) === null || _b === void 0 ? void 0 : _b.apply(null, [ev]);
            await delay(this.reconnectSeconds * Second);
            this.connect();
        };
        this.connect();
    }
    // adding and removing handlers
    on(messageType, handler) {
        this.handlers[messageType] = handler;
    }
    removeHandler(messageType) {
        delete this.handlers[messageType];
    }
    onEvent(eventName, handler) {
        this.eventHandlers[eventName] = handler;
    }
    removeEventHandler(eventName) {
        delete this.eventHandlers[eventName];
    }
    // rest of functionality
    send(message) {
        var _a;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(message));
    }
    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = this.onopen;
        this.ws.onmessage = this.onmessage;
        this.ws.onerror = this.onerror;
        this.ws.onclose = this.onclose;
    }
}
const url = `ws://${window.location.host}/ws`;
export default new Network(url);
