import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Canvas from '../Canvas.vue'

describe('Canvas Component', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    // Create a mock context that implements CanvasRenderingContext2D
    const mockContext = new Proxy({} as CanvasRenderingContext2D, {
      get: (target, prop) => {
        // Return a spy function for any method that doesn't exist
        if (!(prop in target)) {
          return vi.fn()
        }
        return target[prop as keyof CanvasRenderingContext2D]
      }
    })

    // Set some basic properties that are commonly used
    mockContext.strokeStyle = ''
    mockContext.lineWidth = 0
    mockContext.fillStyle = ''

    // Mock getContext
    HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext)

    wrapper = mount(Canvas)
  })

  it('renders canvas element', () => {
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('prevents default scroll behavior', () => {
    const canvas = wrapper.find('canvas').element
    const wheelEvent = new WheelEvent('wheel')
    const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault')
    
    canvas.dispatchEvent(wheelEvent)
    expect(preventDefaultSpy).toHaveBeenCalled()
  })
}) 