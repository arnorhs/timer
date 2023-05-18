import './style.css'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <p id="time" class="timer"></p>
    <div id="timelist"></div>
  </div>
`

setupCounter(
  document.querySelector<HTMLParagraphElement>('#time')!,
  document.querySelector<HTMLDivElement>('#timelist')!,
)
