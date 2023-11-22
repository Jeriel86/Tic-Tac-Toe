import React, { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function PlayerInput({ label, value, onChange }) {
  return (
    <label>
      {label}:
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Form({ playerNames, setPlayerNames }) {
  return (
    <div className="player-names-container">
      <div className="player-names-form">
        <PlayerInput
          label="Player 1"
          value={playerNames.player1}
          onChange={(value) => setPlayerNames({ ...playerNames, player1: value })}
        />
        <PlayerInput
          label="Player 2"
          value={playerNames.player2}
          onChange={(value) => setPlayerNames({ ...playerNames, player2: value })}
        />
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay, playerNames, playWithBot }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    const currentPlayerSymbol = xIsNext ? "X" : "O";

    nextSquares[i] = currentPlayerSymbol;
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    const winningPlayer = winner === "X" ? playerNames.player1 : playerNames.player2;
    status = `Winner: ${winningPlayer} (${winner})`;
  } else {
    const currentPlayerSymbol = xIsNext ? "X" : "O";
    const nextPlayer = currentPlayerSymbol === "X" ? playerNames.player1 : playerNames.player2;
    status = `Next player: ${nextPlayer} (${currentPlayerSymbol})`;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [playerNames, setPlayerNames] = useState({ player1: "You", player2: "Bot" });
  const [playWithBot, setPlayWithBot] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">

      <>
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} playerNames={playerNames} playWithBot={playWithBot} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
        {(playWithBot) && (
          <div className="form">
            <Form playerNames={playerNames} setPlayerNames={setPlayerNames} />
          </div>
        )}
      </>

    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
