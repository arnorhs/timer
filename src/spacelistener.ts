type Props = {
  onSpaceDown?: () => void
  onSpaceUp?: (time: number) => void
}

export function spaceListener({ onSpaceDown: onSpacePressed, onSpaceUp: onSpaceReleased }: Props) {
  let spacePressedAt = 0

  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      if (spacePressedAt === 0) {
        spacePressedAt = Date.now()
        onSpacePressed?.()
      }
    }
  })

  document.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
      if (spacePressedAt > 0) {
        onSpaceReleased?.(Date.now() - spacePressedAt)
      }

      spacePressedAt = 0
    }
  })

  return {
    status: () => spacePressedAt > 0,
  }
}
