const init = () => {
  const node = document.createElement('section')
  node.classList.add('toast-group')

  document.firstElementChild.insertBefore(node, document.body)
  return node
}

const createToast = content => {
  const node = document.createElement('output')

  node.innerHTML = content
  node.classList.add('toast')
  node.setAttribute('role', 'status')

  return node
}

const addToast = (toast, position = 'bottom') => {
  const { matches: motionOK } = window.matchMedia(
    '(prefers-reduced-motion: no-preference)'
  )

  Toaster.children.length && motionOK
    ? flipToast(toast, position)
    : Toaster.appendChild(toast)
}

const Toaster = init()

const flipToast = (toast, position = 'bottom') => {
  const first = Toaster.offsetHeight

  position === 'top' ? Toaster.insertBefore(toast, Toaster.firstChild) : Toaster.appendChild(toast)

  const last = Toaster.offsetHeight

  const invert = position === 'top' ? first - last : last - first


  Toaster.animate([
    { transform: `translateY(${invert}px)` },
    { transform: 'translateY(0)' }
  ], {
    duration: 150,
    easing: 'ease-out',
  })
}

const Toast = (text, option = { position: 'top' }) => {
  let classPosition

  if (option.position === 'bottom') {
    classPosition = 'toast--bottom'
  }
  if (option.position === 'top') {
    classPosition = 'toast--top'
  }

  Toaster.classList.add(classPosition)
  let toast = createToast(text)
  addToast(toast, option.position)

  return new Promise(async (resolve, reject) => {
    await Promise.allSettled(
      toast.getAnimations().map(animation =>
        animation.finished
      )
    )
    Toaster.removeChild(toast)
    resolve()
  })
}
