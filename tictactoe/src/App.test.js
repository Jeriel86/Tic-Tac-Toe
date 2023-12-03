/* import React from '@testing-library/react'
import { shallow } from 'enzyme'
import App from './App'

describe('PlayerInput', () => {
  it('should render a label with the provided label text', () => {
    const wrapper = shallow(<App />)
    const label = wrapper.find('PlayerInput').find('label')
    expect(label.text()).toBe('Player 1:')
  })

  it('should render an input field with the provided value', () => {
    const wrapper = shallow(<App />)
    const input = wrapper.find('PlayerInput').find('input')
    expect(input.prop('value')).toBe('X')
  })

  it('should call the provided onChange handler when the input value changes', () => {
    const wrapper = shallow(<App />)
    const onChangeMock = jest.fn()
    wrapper.find('PlayerInput').find('input').simulate('change', { target: { value: 'Y' } })
    expect(onChangeMock).toHaveBeenCalledWith('Y')
  })
})

describe('Checkbox', () => {
  it('should render a checkbox with the provided label text', () => {
    const wrapper = shallow(<App />)
    const checkbox = wrapper.find('Checkbox').find('input')
    const label = wrapper.find('Checkbox').find('label')
    expect(label.text()).toBe('Play against bot')
    expect(checkbox.prop('checked')).toBe(true)
  })

  it('should call the provided onChange handler when the checkbox is checked or unchecked', () => {
    const wrapper = shallow(<App />)
    const onChangeMock = jest.fn()
    wrapper.find('Checkbox').find('input').simulate('change', { target: { checked: false } })
    expect(onChangeMock).toHaveBeenCalledWith(false)
    wrapper.find('Checkbox').find('input').simulate('change', { target: { checked: true } })
    expect(onChangeMock).toHaveBeenCalledWith(true)
  })
})
 */
