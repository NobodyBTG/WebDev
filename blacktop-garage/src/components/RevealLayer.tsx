import { useEffect, useRef } from 'react'

const SPOTLIGHT_R = 260

interface Props {
  image: string
  cursorX: number
  cursorY: number
}

export default function RevealLayer({ image, cursorX, cursorY }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  // Size canvas to viewport
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Redraw mask on every cursor position change
  useEffect(() => {
    const canvas = canvasRef.current
    const div = divRef.current
    if (!canvas || !div) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const grad = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R)
    grad.addColorStop(0,    'rgba(255,255,255,1)')
    grad.addColorStop(0.4,  'rgba(255,255,255,1)')
    grad.addColorStop(0.6,  'rgba(255,255,255,0.75)')
    grad.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    grad.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    grad.addColorStop(1,    'rgba(255,255,255,0)')

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
    ctx.fill()

    const dataUrl = canvas.toDataURL()
    div.style.maskImage = `url(${dataUrl})`
    div.style.webkitMaskImage = `url(${dataUrl})`
    div.style.maskSize = '100% 100%'
    ;(div.style as CSSStyleDeclaration & { webkitMaskSize: string }).webkitMaskSize = '100% 100%'
  })

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />
      <div
        ref={divRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  )
}
