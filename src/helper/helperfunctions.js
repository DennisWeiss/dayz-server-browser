const debounce = (f, interval, immediate) => {
  let blocked = false
  let timeout
  return (...args) => {
    const context = this
    const callAfter = callFunction => () => {
      if (callFunction) {
        f.apply(context, args)
      }
      blocked = false
    }
    if (blocked) {
      clearTimeout(timeout)
      timeout = setTimeout(callAfter(true), interval)
    } else  {
      if (immediate) {
        f.apply(context, args)
      }
      blocked = true
      timeout = setTimeout(callAfter(!immediate), interval)
    }
  }
}

export {debounce}