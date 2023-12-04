/* eslint-disable no-undef */
import { evaluate, canFork, calculateWinner, gameStatus } from './App.js'

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

describe('caculate function', () => {
  it('should return X when the player X wins the game', () => {
    const squares = ['X', 'X', 'X', 'O', 'X', 'O', 'O', 'X', 'O']
    const result = calculateWinner(squares)

    expect(result).toBe('X')
  })
  it('should return null when no one wins the game', () => {
    const squares = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']
    const result = calculateWinner(squares)

    expect(result).toBe(null)
  })
})

describe('game status function', () => {
  it('should return Next Player: X', () => {
    const squares = ['X', null, null, null, 'O', null, null, 'O', 'X']
    const isNext = true
    const result = gameStatus(squares, isNext)

    expect(result).toBe('Next player: X')
  })
  it('should return Winner: O', () => {
    const squares = ['X', 'O', 'X', null, 'O', null, null, 'O', 'X']
    const isNext = true
    const result = gameStatus(squares, isNext)

    expect(result).toBe('Winner: O')
  })
})
