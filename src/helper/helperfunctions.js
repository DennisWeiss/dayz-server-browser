const debounce = (f, interval, immediate) => {
  let blocked = false
  let timeout
  return (...args) => {
    console.log(...args, blocked, timeout)
    const context = this
    const callAfter = callFunction => () => {
      // console.log('calling after', blocked, timeout, callFunction)
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
      console.log(blocked, immediate, timeout)
    }
  }
}

const ensureDigits = (number, digits) => number.toString().length >= digits ?
    number.toString() :
    [...Array(digits - number.toString().length)].map(_ => '0').join('') + number.toString()


export {debounce, ensureDigits}