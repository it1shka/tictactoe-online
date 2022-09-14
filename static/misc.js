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
