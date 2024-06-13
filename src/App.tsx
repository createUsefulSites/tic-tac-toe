import { useCallback, useState } from 'react';
import './App.css';

type winnerReturnType = 'x' | 'o' | null | 'draw';

function checkForWinner(matrix: Array<Array<'x' | 'o' | ''>>): winnerReturnType {
  for (let i = 0; i < 3; i++) {
    if (matrix[i][0] === matrix[i][1] && matrix[i][1] === matrix[i][2] && matrix[i][0] !== '') {
      return matrix[i][0] as 'x' | 'o';
    }
  }

  for (let j = 0; j < 3; j++) {
    if (matrix[0][j] === matrix[1][j] && matrix[1][j] === matrix[2][j] && matrix[0][j] !== '') {
      return matrix[0][j] as 'x' | 'o';
    }
  }

  if (matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2] && matrix[0][0] !== '') {
    return matrix[0][0] as 'x' | 'o';
  }

  if (matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0] && matrix[0][2] !== '') {
    return matrix[0][2] as 'x' | 'o';
  }

  let isDraw: boolean = true;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === '') {
        isDraw = false;
        break;
      }
    }
  }

  if (isDraw) return 'draw';

  return null;
}

export default function App() {
  const [matrix, setMatrix] = useState<Array<Array<'x' | 'o' | ''>>>(
    Array.from({ length: 3 }, () => new Array(3).fill('')),
  );
  const [turn, setTurn] = useState<'x' | 'o'>('x');
  const [winner, setWinner] = useState<'x' | 'o' | 'draw' | ''>('');

  const handleClick = useCallback(
    (i: number, j: number) => {
      setMatrix((prev) => {
        const newMatrix = prev.map((row) => [...row]);
        if (newMatrix[i][j] === '') {
          newMatrix[i][j] = turn;
          setTurn(turn === 'x' ? 'o' : 'x');

          const winner = checkForWinner(newMatrix);
          if (winner) {
            setWinner(winner);
            setMatrix(Array.from({ length: 3 }, () => new Array(3).fill('')));
            setTurn('x');
          }
        }
        return newMatrix;
      });
    },
    [turn],
  );

  return (
    <>
      {winner !== '' && <Modal winner={winner} setWinner={setWinner} />}

      <div className='wrapper'>
        <div className='header'>
          Ход: <span style={{ color: '#30c5d2' }}>{turn.toUpperCase()}</span>
        </div>
        <div className='grid'>
          {matrix.map((row, i) => (
            <div key={i} className='row'>
              {row.map((cell, j) => (
                <div className='item' key={j} onClick={() => handleClick(i, j)}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Modal({
  winner,
  setWinner,
}: {
  winner: string;
  setWinner: React.Dispatch<React.SetStateAction<'' | 'x' | 'o' | 'draw'>>;
}) {
  let message: string;

  switch (winner) {
    case 'x':
      message = 'Победитель - Х';
      break;

    case 'o':
      message = 'Победитель - O';
      break;

    default:
      message = 'Ничья!';
      break;
  }

  return (
    <>
      <div className='back'></div>
      <div className='modal'>
        <div className='modal_header'>{message}</div>
        <button className='button' onClick={() => setWinner('')}>
          Начать
        </button>
      </div>
    </>
  );
}
