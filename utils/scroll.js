const BezierEasing = require('bezier-easing')

const handler = {
  $(el) {
    return document.querySelector(el)
  },
  on(el, events, listener) {
    if (!(events instanceof Array)) events = [events]
    events.forEach(event => {
      el.addEventListener(event, listener, { passive: true })
    })
  },
  remove(el, events, listener) {
    if (!(events instanceof Array)) events = [events]
    events.forEach(event => {
      el.removeEventListener(event, listener)
    })
  }
}

export const Easing = {
  ease: [0.25, 0.1, 0.25, 1.0],
  linear: [0, 0.0, 1, 1.0],
  'ease-in': [0.42, 0.0, 1, 1.0],
  'ease-out': [0, 0.0, 0.58, 1.0],
  'ease-in-out': [0.42, 0.0, 0.58, 1.0]
}

export const scrollTo = (el, duration = 500, options) => {
  options = options || {}
  options.easing = Easing.ease

  if (typeof el === 'string') {
    el = handler.$(el)
  }

  const page = handler.$('html, body')
  const events = [
    'scroll',
    'mousedown',
    'wheel',
    'DOMMouseScroll',
    'mousewheel',
    'keyup',
    'touchmove'
  ]

  let abort = false

  const abortFn = function() {
    abort = true
  }

  handler.on(page, events, abortFn)

  let elementY = 0 // 元素距上一个元素的间隔高度
  let initialY = window.pageYOffset
  if (Object.is(typeof el, 'number')) {
    elementY = el
  } else {
    elementY = initialY + el.getBoundingClientRect().top
  }

  let targetY =
    document.body.scrollHeight - elementY < window.innerHeight ?
      document.body.scrollHeight - window.innerHeight :
      elementY

  if (options.offset) {
    targetY += options.offset
  }

  const diff = targetY - initialY
  const easing = Reflect.apply(BezierEasing, BezierEasing, options.easing)
  let start

  const done = function() {
    handler.remove(page, events, abortFn)
    if (abort && options.onCancel) {
      options.onCancel()
    }
    if (!abort && options.onDone) {
      options.onDone()
    }
  }

  if (!diff) return

  window.requestAnimationFrame(function step(timestamp) {
    if (abort) return done()
    if (!start) start = timestamp

    const time = timestamp - start
    let progress = Math.min(time / duration, 1)
    progress = easing(progress)

    window.scrollTo(0, initialY + diff * progress)

    if (time < progress) {
      window.requestAnimationFrame(step)
    } else {
      done()
    }
  })
}