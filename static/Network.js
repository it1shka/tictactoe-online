import GameWindow from "./GameWindow.js";
import { delay, Second, showAlert, websocketCloseReason } from "./misc.js";
class Network {
    constructor(url) {
        this.url = url;
        this.reconnectSeconds = 10;
        this.handlers = {};
        this.ws = null;
        this.onopen = (_) => {
            console.log(`Established connection to ${this.url}.`);
            showAlert('Established WebSocket connection!');
        };
        this.onmessage = (ev) => {
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
        };
        this.onerror = (_) => {
            console.error('WebSocket error');
            showAlert('WebSocket error occured.');
        };
        this.onclose = async (ev) => {
            var _a;
            (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
            this.ws = null;
            const code = ev.code;
            const reason = websocketCloseReason(code);
            console.error(`WebSocket closed due to reason: ${reason}.`);
            showAlert(`WebSocket closed. Reconnecting in ${this.reconnectSeconds} seconds...`);
            // some additional logic to close currently running game
            this.handlers = {};
            GameWindow.layout = 'no-game';
            //
            await delay(this.reconnectSeconds * Second);
            this.connect();
        };
    }
    on(messageType, handler) {
        this.handlers[messageType] = handler;
        return this;
    }
    removeHandler(messageType) {
        delete this.handlers[messageType];
    }
    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = this.onopen;
        this.ws.onmessage = this.onmessage;
        this.ws.onerror = this.onerror;
        this.ws.onclose = this.onclose;
    }
    send(message) {
        var _a;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(message));
    }
}
const url = `ws://${window.location.host}/ws`;
const network = new Network(url);
network.connect();
export default network;
