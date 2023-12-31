import React, { useEffect, useState } from 'react'
import DarkModeToggle from 'react-dark-mode-toggle'

export function Square ({ value, onSquareClick, darkMode }) {
  if (darkMode) {
    return <button className={value === 'X' ? 'squareXdark' : 'squareOdark'} onClick={onSquareClick}>{value}</button>
  } else {
    return <button className={value === 'X' ? 'squareX' : 'squareO'} onClick={onSquareClick}>{value}</button>
  }
}

const Checkbox = ({ label, value, onChange }) => {
  return (
    <label>
      <input type="checkbox" checked={value} onChange={onChange} />
      {label}
    </label>
  )
}

export function PlayerInput ({ label, value, onChange, classNames }) {
  return (
    <label>
      {label}:
      <input
        className={classNames}
        type="text"
        value={value}
        maxLength={9}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function Form ({ playerNames, setPlayerNames, classNames }) {
  return (
    <div className="player-names-container">
      <div className="player-names-form">
        <PlayerInput
          label="Player 1"
          value={playerNames.player1}
          onChange={(value) => setPlayerNames({ ...playerNames, player1: value })}
          classNames={classNames}
        />
        <PlayerInput
          label="Player 2"
          value={playerNames.player2}
          onChange={(value) => setPlayerNames({ ...playerNames, player2: value })}
          classNames={classNames}
        />
      </div>
    </div>
  )
}

function Board ({ xIsNext, squares, onPlay, playerNames, playWithBot, darkMode }) {
  function handleClick (i) {
    if (squares[i] || calculateWinner(squares)) {
      return
    }

    if (playWithBot && !xIsNext) {
    // bot plays O
    // player should not click on the board if it is bot's turn
      return
    }

    const nextSquares = squares.slice()
    const currentPlayerSymbol = xIsNext ? 'X' : 'O'

    nextSquares[i] = currentPlayerSymbol
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares)
  let status
  if (winner) {
    const winningPlayer = winner === 'X' ? playerNames.player1 : playerNames.player2
    status = `Winner: ${winningPlayer} (${winner})`
  } else {
    const currentPlayerSymbol = xIsNext ? 'X' : 'O'
    const nextPlayer = currentPlayerSymbol === 'X' ? playerNames.player1 : playerNames.player2
    status = `Next player: ${nextPlayer} (${currentPlayerSymbol})`
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} darkMode={darkMode} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} darkMode={darkMode}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} darkMode={darkMode}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} darkMode={darkMode}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} darkMode={darkMode}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} darkMode={darkMode}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} darkMode={darkMode}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} darkMode={darkMode}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} darkMode={darkMode}/>
      </div>
    </>
  )
}

export default function Game () {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const [playerNames, setPlayerNames] = useState({ player1: 'You', player2: 'Bot' })
  const [playWithBot, setPlayWithBot] = useState(true)

  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]
  const [timeTravel, setTimeTravel] = useState(false)

  const winner = calculateWinner(currentSquares)
  const gameOver = (winner != null) || moveLeft(currentSquares).length === 0
  const botToMove = (playWithBot && !xIsNext) && !gameOver && !timeTravel
  const playerToMove = (!playWithBot || xIsNext) && !gameOver

  const [isDarkMode, setIsDarkMode] = useState(() => false)

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  })

  function playerMove (nextSquares) {
    if (!playerToMove) { return }

    setTimeTravel(false)
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  useEffect(() => {
    function botMove () {
      const nextSquares = currentSquares.slice()
      const nextMove = evaluate(nextSquares)
      nextSquares[nextMove] = 'O'

      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
      setHistory(nextHistory)
      setCurrentMove(nextHistory.length - 1)
    }

    if (botToMove) { setTimeout(botMove, 500) }
  }, [botToMove, currentSquares, history, currentMove])

  function jumpTo (nextMove) {
    setCurrentMove(nextMove)
    setTimeTravel(true)
  }

  const moves = history.map((squares, move) => (
    <option key={move} value={move}>
      {move === 0 ? 'Go to game start' : `Go to move #${move}`}
    </option>
  ))

  const status = gameStatus(currentSquares, xIsNext)

  const classNames = [['bwd_button', 'fwd_button', 'move_dropdown', 'playerName_input'],
    ['bwd_buttondark', 'fwd_buttondark', 'move_dropdowndark', 'playerName_inputdark']]
  const classNamesMode = checkDarkMode(isDarkMode)

  function checkDarkMode (isDarkMode) {
    if (isDarkMode) {
      return 1
    }
    return 0
  }

  return (
    <div className="game">
      <>
        <div className="game-board">
            <Board status={status} xIsNext={xIsNext} squares={currentSquares} onPlay={playerMove} playerNames={playerNames} playWithBot={playWithBot} darkMode={isDarkMode} />
        </div>

        <div className="game-info">

          {/* Navigation buttons */}
          <div>
            {/* backward button */}
            <button className={classNames[classNamesMode][0]} onClick={() => jumpTo(currentMove - 1)} disabled={currentMove === 0}>
              Backward
            </button>
            {/* to separate the fwd and bwd buttons */}
            <span className="span-margin"></span>
            {/* forward button */}
            <button className={classNames[classNamesMode][1]} onClick={() => jumpTo(currentMove + 1)} disabled={currentMove === history.length - 1}>
              Forward
            </button>
          </div>

          {/* Drop-down list of move-history */}
          <div>
            <label htmlFor="moveSelector">Select move: </label>
            <select className={classNames[classNamesMode][2]} id="moveSelector" value={currentMove} onChange={(e) => jumpTo(Number(e.target.value))}>
              {moves}
            </select>
          </div>

          {/* playernames and Bot checkboxes part (below Select move) */}
          <div className="checkbox-container">
            <Checkbox
              label="Play against bot"
              value={playWithBot}
              onChange={() => { setPlayWithBot(p => !p); setPlayerNames({ player1: 'You', player2: 'Bot' }) }}
            />
            <Checkbox
              label="Enter playernames"
              value={!playWithBot}
              onChange={() => setPlayWithBot(p => !p)}
            />
          </div>

        </div>

        {(!playWithBot) && (
            <div className="form">
              <Form playerNames={playerNames} setPlayerNames={setPlayerNames} classNames={classNames[classNamesMode][3]}/>
            </div>
        )}
      </>
      <div className="toggle-button">
        <DarkModeToggle onChange = {setIsDarkMode} checked = {isDarkMode} size = {40}/>
      </div>
    </div>
  )
}
const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

export function calculateWinner (squares) {
  const winningLines = matchingLines(squares, line => {
    return line[0] && line[1] === line[0] && line[2] === line[0]
  })

  if (winningLines.length > 0) { return squares[winningLines[0][0]] }
  return null
}

export function gameStatus (squares, xIsNext) {
  const winner = calculateWinner(squares)
  let status
  if (winner) {
    status = 'Winner: ' + winner
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }
  return status
}

function moveLeft (squares) {
  return squares.map((currElement, index) => {
    if (currElement === 'X' || currElement === 'O') {
      return null
    }
    return index
  }).filter((item) => item !== null)
}

function matchingLines (squares, checker) {
  return lines.filter(line => checker(line.map(i => squares[i])))
}

export function canFork (player, squares) {
  const movesLeft = moveLeft(squares)
  for (let j = 0; j < movesLeft.length; j++) {
    const i = movesLeft[j]
    const newSquares = squares.slice()
    newSquares[i] = player
    const winableLines = matchingLines(newSquares, line => line.join('') === (player + player))
    if (winableLines.length > 1) { return true }
  };
  return false
}

export function evaluate (squares) {
  // 1. win game in one move, if possible
  const winableLines = matchingLines(squares, line => line.join('') === 'OO')
  if (winableLines.length > 0) {
    const winningSquare = winableLines[0].filter(i => !squares[i])[0]
    return winningSquare
  }
  // 2. block opponent from winning this move
  const blockableLines = matchingLines(squares, line => line.join('') === 'XX')
  if (blockableLines.length > 0) { return blockableLines[0].filter(i => !squares[i])[0] }

  const movesToCheck = moveLeft(squares)

  // 3. middle square
  if (movesToCheck.includes(4)) {
    return 4
  }

  // 4. try to avoid fork
  const possibles = movesToCheck.filter(i => {
    const newSquares = squares.slice()
    newSquares[i] = 'O'
    return !canFork('X', newSquares)
  })

  if (possibles.length > 0) { return possibles[Math.floor(Math.random() * possibles.length)] } else { return movesToCheck[Math.floor(Math.random() * movesToCheck.length)] }
}
