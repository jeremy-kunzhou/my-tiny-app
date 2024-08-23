document.addEventListener("DOMContentLoaded", () => {
  console.log('load timer js')
  const elementHour = $('#timer-h')
  const elementMinute = $('#timer-m')
  const elementSecond = $('#timer-s')
  const timerWrapper = $('#timer-wrapper')
  const tickRecordList = $('#tick-record-list')

  let defaultTimeLength = 20
  let timeLength = defaultTimeLength * 60;

  const { h, m, s } = timeTransfer(timeLength)
  display({ h, m, s })

  const controlStart = $('#button-timer-start');
  const controlPause = $('#button-timer-pause');
  const controlReset = $('#button-timer-reset');
  const controlInc = $('#button-timer-inc');
  const controlDec = $('#button-timer-dec');
  const controlInc5 = $('#button-timer-inc-5');
  const controlDec5 = $('#button-timer-dec-5');
  const tickButton = $('#button-timer-tick');
  let tickRecord = []

  const NOT_START = 0
  const RUNNING_NORMAL = 1
  const RUNNING_OVERTIME = 2
  const PAUSE = 3

  let mode = NOT_START

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
    if (mode == NOT_START) {
      tickRecord = []
      updateTickRecord(tickRecord)
    }
    if (mode == NOT_START || mode == PAUSE) {
      changeModeStyle(timeLength > 0 ? RUNNING_NORMAL : RUNNING_OVERTIME)
      intervalHandler = setInterval(() => {
        display(timeTransfer(Math.abs(--timeLength)))

        if (mode != 3 && timeLength < 0) {
          changeModeStyle(RUNNING_OVERTIME)
        }
      }, 1000)
    }

  }

  function stop() {
    changeModeStyle(NOT_START)
    clearInterval(intervalHandler)
  }

  function pause() {
    changeModeStyle(PAUSE)
    clearInterval(intervalHandler)
  }

  function reset() {
    stop()
    timeLength = defaultTimeLength * 60
    display(timeTransfer(timeLength))
  }

  function changeModeStyle(targetMode) {
    mode = targetMode
    timerWrapper.removeClass('timer-over')
    timerWrapper.removeClass('timer-running')
    timerWrapper.removeClass('timer-pause')
    if (mode == PAUSE) {
      timerWrapper.addClass('timer-pause')
    } else if (mode == RUNNING_NORMAL) {
      timerWrapper.addClass('timer-running')
    } else if (mode == RUNNING_OVERTIME) {
      timerWrapper.addClass('timer-over')
    }
  }

  function updateTickRecord(arr) {
    tickRecordList.html('')
    arr.forEach(([m, e, e2]) => {
      const { m: min1, s: s1 } = timeTransfer(e)
      const { m: min2, s: s2 } = timeTransfer(e2)
      tickRecordList.append($(`<li class='${m == RUNNING_NORMAL ? "normal" : "overtime"}'>${min1}:${s1} [${min2}:${s2}]</li>`))
    })
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
    if (mode == NOT_START) {
      defaultTimeLength++
      timeLength = defaultTimeLength * 60
      display(timeTransfer(timeLength))
    }
  })

  controlDec.on('click', () => {
    if (mode == NOT_START) {
      defaultTimeLength--
      timeLength = defaultTimeLength * 60
      display(timeTransfer(timeLength))
    }
  })

  controlInc5.on('click', () => {
    if (mode == NOT_START) {
      defaultTimeLength += 5
      timeLength = defaultTimeLength * 60
      display(timeTransfer(timeLength))
    }
  })

  controlDec5.on('click', () => {
    if (mode == NOT_START) {
      defaultTimeLength = Math.max(1, defaultTimeLength - 5)
      timeLength = defaultTimeLength * 60
      display(timeTransfer(timeLength))
    }
  })

  tickButton.on('click', () => {
    if (mode == RUNNING_NORMAL || mode == RUNNING_OVERTIME) {
      const base = tickRecord.length == 0 ? defaultTimeLength * 60 : tickRecord[tickRecord.length - 1][3]
      tickRecord.push([mode, base - timeLength, defaultTimeLength * 60 - timeLength, timeLength])
      updateTickRecord(tickRecord)
    }
  })

})