export const keys = {
  a: { pressed: false },
  d: { pressed: false },
  left: { pressed: false },
  right: { pressed: false},
  space: {pressed: false },
  k: {pressed: false },
  Enter: {pressed: false },
  q: {pressed: false },
  z: {pressed: false },
  x: {pressed: false },
  n: {pressed: false },
  m: {pressed: false },
  o: {pressed: false },
  l: {pressed: false },
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
  case 'Enter':
    keys.Enter.pressed = true
    break
  case 'KeyQ':
    keys.q.pressed = true
    break
  case 'KeyZ':
    keys.z.pressed = true
    break
  case 'KeyX':
    keys.x.pressed = true
    break
  case 'KeyN':
    keys.n.pressed = true
    break
  case 'KeyM':
    keys.m.pressed = true
    break
  case 'KeyL':
    keys.l.pressed = true
    break
  case 'KeyO':
    keys.o.pressed = true
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
      case 'Enter':
        keys.Enter.pressed = false
        break
      case 'KeyQ':
        keys.q.pressed = false
        break
      case 'KeyZ':
        keys.z.pressed = false
        break
      case 'KeyX':
        keys.x.pressed = false
        break
      case 'KeyN':
        keys.n.pressed = false
        break
      case 'KeyM':
        keys.m.pressed = false
        break
      case 'KeyL':
          keys.l.pressed = false
          break
      case 'KeyO':
        keys.o.pressed = false
        break
      }
  })
}

