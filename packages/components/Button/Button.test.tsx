import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// import Icon from '../Icon/index.vue'
import Button from './Button.vue'

describe('Button.vue', () => {
  const onClick = vi.fn()
  test('basic button', async () => {
    const wrapper = mount(() => (
      <Button type='primary' {...{ onClick }}>
        button content
      </Button>
    ))

    // class
    expect(wrapper.classes()).toContain('er-button--primary')

    // slot
    expect(wrapper.get('button').text()).toBe('button content')

    // events
    await wrapper.get('button').trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  test('disabled button', async () => {
    const wrapper = mount(() => (
      <Button disabled {...{ onClick }}>
        disabled button
      </Button>
    ))

    // class
    expect(wrapper.classes()).toContain('is-disabled')

    // attrs
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.find('button').element.disabled).toBeTruthy()

    // events
    await wrapper.get('button').trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  test('loading button', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      },
      slots: {
        default: 'loading button'
      },
      global: {
        stubs: ['ErIcon']
      }
    })

    // class
    expect(wrapper.classes()).toContain('is-loading')

    // attrs
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.find('button').element.disabled).toBeTruthy()

    // events
    wrapper.get('button').trigger('click')
    expect(wrapper.emitted()).not.toHaveProperty('click')

    // icon
    // const iconElement = wrapper.findComponent(Icon)
    // expect(iconElement.exists()).toBeTruthy()
    // expect(iconElement.attributes('icon')).toBe('spinner')
  })

  test.todo('icon button', () => {
    // const wrapper = mount(Button, {
    //   props: {
    //     icon: 'arrow-up'
    //   },
    //   slots: {
    //     default: 'icon button'
    //   },
    //   global: {
    //     stubs: ['ErIcon']
    //   }
    // })

    // const iconElement = wrapper.findComponent(Icon)
    // expect(iconElement.exists()).toBeTruthy()
    // expect(iconElement.attributes('icon')).toBe('arrow-up')
  })
})
