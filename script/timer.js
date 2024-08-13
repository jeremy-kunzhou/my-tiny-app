document.addEventListener("DOMContentLoaded", () => {
  console.log('load timer js')
  const elementHour = $('#timer-h')
  const elementMinute = $('#timer-m')
  const elementSecond = $('#timer-s')

  let defaultTimeLength = 30
  let timeLength = defaultTimeLength * 60;

  const { h, m, s } = timeTransfer(timeLength)
  display({ h, m, s })

  const controlStart = $('#button-timer-start');
  const controlPause = $('#button-timer-pause');
  const controlReset = $('#button-timer-reset');
  const controlInc = $('#button-timer-inc');
  const controlDec = $('#button-timer-dec');

  // 0 not start 1 running 2 pause 
  let mode = 0

  function display({ h, m, s }) {
    elementHour.text((h + '').padStart(2, 0))
    elementMinute.text((m + '').padStart(2, 0))
    elementSecond.text((s + '').padStart(2, 0))
  }


  function timeTransfer(numSecond) {
    if (numSecond <= 0) {
      return {
        h: 0, m: 0, s: 0
      }
    }
    const h = numSecond / 3600 >> 0
    const m = (numSecond % 3600) / 60 >> 0
    const s = numSecond % 60
    return { h, m, s }
  }

  let intervalHandler = null;

  function startTimer() {
    if (mode == 0 || mode == 2) {
      mode = 1
      intervalHandler = setInterval(() => {
        display(timeTransfer(--timeLength))

        if (timeLength == 0) {
          stop()
        }
      }, 1000)
    }

  }

  function stop() {
    mode = 0
    clearInterval(intervalHandler)
  }

  function pause() {
    mode = 2
    clearInterval(intervalHandler)
  }

  function reset() {
    stop()
    timeLength = defaultTimeLength * 60
    display(timeTransfer(timeLength))
  }

  controlStart.on('click', () => {
    startTimer()
  })

  controlPause.on('click', () => {
    pause()
  })

  controlReset.on('click', () => {
    reset()
  })

  controlInc.on('click', () => {
    if (mode == 0) {
      defaultTimeLength++
      timeLength = defaultTimeLength * 60
      display(timeTransfer(timeLength))
    }
  })

  controlDec.on('click', () => {
    if (mode == 0) {
      defaultTimeLength--
      timeLength = defaultTimeLength * 60
      display(timeTransfer(timeLength))
    }
  })

})