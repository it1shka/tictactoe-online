export const Second = 1000

export function delay(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time)
  })
}

export async function showAlert(message?: string) {
  console.log(`Creating with message ${message}`)
  const alertElement = document.createElement('aside')
  alertElement.classList.add('alert-window')
  alertElement.innerText = message ?? 'Warning!'
  document.body.appendChild(alertElement)
  await delay(10)
  alertElement.classList.toggle('opened')
  await delay(3 * Second)
  alertElement.classList.toggle('opened')
  await delay(2 * Second)
  alertElement.remove()
}