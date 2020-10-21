import React from 'react'
import ReactDom from 'react-dom'
import './index.css'

function Square(props) {
    const className = "square" + (props.shouldHighlight ? " highlight" : "");
    return (
        <button className={className} onClick={props.onClick}>
            {props.content}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        const shouldHighlight = this.props.squaresToHighlight?.includes(i) ?? false;
        return <Square
            content={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            shouldHighlight={shouldHighlight}
        />;
    }

    renderRow(startIndex, amountOfColumns) {
        const columns = [];

        for (let i = startIndex; i < startIndex + amountOfColumns; i++) {
            columns.push(this.renderSquare(i));
        }

        return (
            <div className="board-row">
                {columns}
            </div>
        );
    }

    render() {
        const rows = [];
        const rowSize = 3;
        const colSize = 3;
        for (let row = 0; row < rowSize; row++) {
            rows.push(this.renderRow(row * colSize, colSize));
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        if (this.state.xIsNext) {
            squares[i] = 'X';
        }
        else {
            squares[i] = 'O';
        }

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winCalcResult = calculateWinner(current.squares);
        let status;
        if (winCalcResult) {
            status = `Winner: ${winCalcResult.winner}`;
        }
        else {
            status = `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`;
        }

        const moves = history.map((step, move) => {
            const desc = move ? `Go to move # ${move}` : 'Go to game start';            

            const isCurrentSelection = move == this.state.stepNumber;

            return (
                <li key={move}>
                    <button className={isCurrentSelection ? "current-selection" : ""} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        squaresToHighlight={winCalcResult?.squares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
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
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner:squares[a],
                squares:[a,b,c]
            };
        }
    }
    return null;
}

// ========================================

ReactDom.render(
    <Game />,
    document.getElementById('root')
);
