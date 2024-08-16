export const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  left: {
    pressed: false
  },
  right: {
    pressed: false
  },
  space: {
    pressed: false
  },
  k: {
    pressed: false
  }
}

export function KeyBordinput() {
  window.addEventListener('keydown', (event) => {
    switch (event.code) {
  case 'KeyA':
    keys.a.pressed = true
    break
  case 'KeyD':
    keys.d.pressed = true
    break
  case 'ArrowLeft':
    keys.left.pressed = true
    break
  case 'ArrowRight':
    keys.right.pressed = true
    break
  case 'Space':
    keys.space.pressed = true
    break
  case 'KeyK':
    keys.k.pressed = true
    break
    }
  })
  //
  window.addEventListener('keyup', (event) => {
    switch (event.code) {
      case 'KeyA':
        keys.a.pressed = false
        break
      case 'KeyD':
        keys.d.pressed = false
        break
      case 'ArrowLeft':
        keys.left.pressed = false
        break
      case 'ArrowRight':
        keys.right.pressed = false
        break
      case 'Space':
        keys.space.pressed = false
        break
      case 'KeyK':
        keys.k.pressed = false
        break
      }
  })
}

