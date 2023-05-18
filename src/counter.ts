import { spaceListener } from './spacelistener'

function renderTime(num: number) {
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
    if (status()) {
      timeEl.style.background = 'rgba(100,255,140, 0.1)'
    } else {
      timeEl.style.background = 'transparent'

      timeEl.textContent = startTime
        ? `${renderTime(Date.now() - startTime)}`
        : 'Press space to start'
    }
    requestAnimationFrame(updateTime)
  }

  function updateList() {
    let str = timeList.map((times) => renderTimeList(times)).join('\n')
    str += renderTimeList(times)

    listEl.innerHTML = `<div class="timelist__wrapper">${str}</div>`
  }

  const { status } = spaceListener({
    onSpaceDown: () => {},

    onSpaceUp: (duration) => {
      const now = Date.now()

      if (lastTime !== undefined) {
        times.push(now - duration - lastTime)

        if (duration < 1000) {
          // checkpoint
          lastTime = now - duration
        } else {
          // end of run
          timeList.push(times)
          times = []
          lastTime = undefined
          startTime = undefined
        }
      } else {
        // start of run
        lastTime = now
        startTime = now
      }

      updateList()
    },
  })

  updateTime()
}

function renderTimeList(times: number[]) {
  if (times.length < 1) {
    return ''
  }
  const strs = times.map((time) => `<div>${renderTime(time)}</div>`)
  if (strs.length > 0) {
    strs.push(`<div class="timelist__total">${renderTime(times.reduce((a, b) => a + b, 0))}</div>`)
  }

  return `<div class="timelist">${strs.join('\n')}</div>`
}
