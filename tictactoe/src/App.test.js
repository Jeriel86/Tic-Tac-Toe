import React from 'react';
import Game, { Square } from './App.js'
import { evaluate, canFork, calculateWinner, gameStatus, PlayerInput} from './App.js'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'



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

describe('chooses right square className', () =>{
  it('should return squareXdark', () => {
    const onSquareClick = jest.fn();
    const darkMode = true;
    const { getByText } = render(<Square value="X" onSquareClick={onSquareClick} darkMode={darkMode} />);
    const result = getByText('X');
  
    expect(result).toHaveClass('squareXdark');
  })
  it('should return SquareO', () => {
    const onSquareClick = jest.fn();
    const darkMode = false;
    const { getByText } = render(<Square value="O" onSquareClick={onSquareClick} darkMode={darkMode} />);
    const result = getByText('O');
  
    expect(result).toHaveClass('squareO');
  })
})

describe('chooses right classNames', () =>{
  it('should return className with dark', () => {
    const { getByText }  = render(<Game />);
    const className = getByText('Forward');
    fireEvent.change(className, {target: { className: 'fwd_buttondark' }});

    expect(className).toHaveClass('fwd_buttondark');
  })
  it('should return className without dark', () => {
    const { getByText }  = render(<Game />);
    const className = getByText('Forward');
  
    expect(className).toHaveClass('fwd_button');
  })
})

test('renders PlayerInput component', () => {
  const { getByLabelText } = render(<PlayerInput label="Player 1" value="John" onChange={() => { }} classNames="input-class" />);
  const inputElement = getByLabelText('Player 1:');
  expect(inputElement).toBeInTheDocument();
  expect(inputElement).toHaveValue('John');
  expect(inputElement).toHaveClass('input-class');
});

test('invokes onChange when input value changes', () => {
  const mockOnChange = jest.fn();
  const { getByLabelText } = render(<PlayerInput label="Player 1" value="John" onChange={mockOnChange} classNames="input-class" />);
  const inputElement = getByLabelText('Player 1:');

  fireEvent.change(inputElement, { target: { value: 'Jane' } });

  expect(mockOnChange).toHaveBeenCalledWith('Jane');
});


test('should jump to the selected move when chosen from the dropdown list', () => {
  const { getByLabelText, getByTestId } = render(<Game />);
  // Get the move selector 
  const moveSelector = getByLabelText('Select move:');
  // Change the selected move in the dropdown list to start
  fireEvent.change(moveSelector, { target: { value: '0' } });

  expect(moveSelector).toHaveValue('0');
});

test('disables backward button when at the beginning', () => {
  const { getByText } = render(<Game />);
  fireEvent.click(getByText('Backward'));

  expect(getByText('Backward')).toBeDisabled();
});

test('disables forward button when at the end', () => {
  const { getByText } = render(<Game />);
  fireEvent.click(getByText('Forward'));

  expect(getByText('Forward')).toBeDisabled();
});


test('should go backward when backward button is clicked', () => {
  const { getByText, getByLabelText } = render(<Game />);
  fireEvent.click(getByText('Backward'));
  const moveSelector = getByLabelText('Select move:');

  expect(moveSelector).toHaveValue('0');
});

test('should go forward when forward button is clicked', () => {
  const { getByText, getByLabelText } = render(<Game />);
  fireEvent.click(getByText('Forward'));
  const moveSelector = getByLabelText('Select move:');
  expect(moveSelector).toHaveValue('0'); // it's still zero since the game hasn't been played
});