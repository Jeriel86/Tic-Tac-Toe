/* eslint-disable no-undef */
import { evaluate, canFork } from './App.js'

describe('evaluate function', () => {
  it('bot should place O to the fourth position', () => {
    const squares = Array(9).fill(null)
    const result = evaluate(squares)

    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(8)
    expect(result).toBe(4)
  })
  it('bot should try to win the game', () => {
    const squares = ['O', 'O', null, null, 'X', null, 'X', null, 'X']
    const result = evaluate(squares)
    expect(result).toBe(2)
  })
  it('bot should block opponent from winning the game', () => {
    const squares = ['X', 'X', null, null, 'O', null, null, null, null]
    const result = evaluate(squares)
    expect(result).toBe(2)
  })
})

describe('fork function', () => {
  it('opponent should not be able to fork here', () => {
    const squares = Array(9).fill(null)
    const result = canFork('X', squares)
    expect(result).toBe(false)
  })
  it('opponent should be able to fork here', () => {
    const squares = ['X', null, null, null, 'O', null, null, null, 'X']
    const result = canFork('X', squares)
    expect(result).toBe(true)
  })
})
