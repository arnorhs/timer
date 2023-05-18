import { spaceListener } from './spacelistener'

function formatTime(num: number) {
  const minutes = Math.floor(num / 60000)
  const seconds = Math.floor((num % 60000) / 1000)
  const milliseconds = Math.floor((num % 1000) / 10)

  return `${minutes}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`
}

export function setupCounter(timeEl: HTMLParagraphElement, listEl: HTMLDivElement) {
  let startTime: number | undefined = undefined
  let lastTime: number | undefined = undefined
  let times: number[] = []
  const timeList: number[][] = []

  function updateTime() {
    if (!status()) {
      timeEl.textContent = startTime
        ? `${formatTime(Date.now() - startTime)}`
        : 'Press space to start'
    }
    requestAnimationFrame(updateTime)
  }

  function updateList() {
    const strs = times.map((time) => `<div>${formatTime(time)}</div>`).reverse()
    if (strs.length > 1) {
      strs.push(
        `<div style="border-top: 1px solid black;"><strong>${formatTime(
          times.reduce((a, b) => a + b, 0),
        )}</strong></div>`,
      )
    }

    listEl.innerHTML = strs.join('')
  }

  const { status } = spaceListener({
    onSpaceDown: () => {},

    onSpaceUp: (duration) => {
      const now = Date.now()

      if (lastTime !== undefined) {
        // so you can end with a down-space
        times.push((duration > 1000 ? now - duration : now) - lastTime)
        updateList()
      }

      if (duration > 1000 && lastTime !== undefined) {
        timeList.push(times)
        times = []
        lastTime = undefined
        startTime = undefined
        updateList()
      } else {
        lastTime = now
        if (times.length === 0) {
          startTime = now
        }
      }
    },
  })

  updateTime()
}
