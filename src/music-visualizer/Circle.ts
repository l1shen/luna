import isEmpty from 'licia/isEmpty'
import MusicPlayer, { IEffect } from './index'

interface IParticle {
  x: number
  y: number
  color: string
  size: number
  opacity: number
}

export default class Circle implements IEffect {
  private musicVisualizer: MusicPlayer
  private particles: IParticle[]
  constructor(musicVisualizer: MusicPlayer) {
    this.musicVisualizer = musicVisualizer

    musicVisualizer.on('resize', this.initParticles)
  }
  draw() {
    const { musicVisualizer } = this
    const data = musicVisualizer.getData()
    const { ctx, canvas } = this.musicVisualizer
    const { width, height } = canvas

    if (isEmpty(this.particles) || this.particles.length !== data.length) {
      this.initParticles(data.length)
    }

    ctx.save()
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#13242f'
    ctx.fillRect(0, 0, width, height)
    for (let i = 0, len = data.length; i < len; i = i + 5) {
      const p = this.particles[i]
      const d = data[i]
      if (p.size == 0) {
        p.size = d
      } else {
        if (p.size < data[i]) {
          p.size += Math.floor((d - p.size) / 5)
          p.opacity = p.opacity + 0.02
          if (p.opacity > 1) {
            p.opacity = 1
          }
        } else {
          p.size -= Math.floor((p.size - d) / 5)
          if (d == 0) {
            p.opacity = 0
          } else {
            p.opacity = p.opacity - 0.02
            if (p.opacity < 0) {
              p.opacity = 0
              p.x = Math.random() * canvas.width
              p.y = Math.random() * canvas.height
            }
          }
        }
      }
      const color = p.color.replace('0)', p.opacity + ')')
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * (canvas.width / 2048), 0, 2 * Math.PI, true)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
  }
  private initParticles = (len: number) => {
    const { musicVisualizer } = this
    const { canvas } = musicVisualizer
    const colors = [
      '105, 210, 231',
      '27, 103, 107',
      '190, 242, 2',
      '235, 229, 77',
      '0, 205, 172',
      '22, 147, 165',
      '249, 212, 35',
      '255, 78, 80',
      '231, 32, 78',
      '12, 202, 186',
      '255, 0, 111',
    ]
    const particles = []

    const { width, height } = canvas
    const colorNum = colors.length
    for (let i = 0; i < len; i++) {
      particles[i] = {
        x: Math.random() * width,
        y: Math.random() * height,
        color: 'rgba(' + colors[Math.floor(Math.random() * colorNum)] + ', 0)',
        size: 0,
        opacity: Math.random() + 0.2,
      }
    }
    this.particles = particles
  }
}
