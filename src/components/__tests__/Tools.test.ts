import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Tools from '../Tools.vue'
import { useToolboxes } from '../../composables/toolboxes'

// Mock the composable
vi.mock('../../composables/toolboxes', () => ({
  useToolboxes: () => ({
    toolBoxes: [
      { id: '1', name: 'Tool 1' },
      { id: '2', name: 'Tool 2' }
    ]
  })
}))

describe('Tools Component', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(Tools)
  })

  it('renders toolboxes', () => {
    const toolboxes = wrapper.findAll('div')
    expect(toolboxes).toHaveLength(2)
  })

  it('renders correct number of tools', () => {
    const { toolBoxes } = useToolboxes()
    expect(wrapper.findAll('div')).toHaveLength(toolBoxes.value!.length)
  })

  it('passes correct props to ToolsBox', () => {
    const toolsBox = wrapper.findComponent({ name: 'ToolsBox' })
    expect(toolsBox.props('id')).toBe('1')
    expect(toolsBox.props('name')).toBe('Tool 1')
  })
}) 