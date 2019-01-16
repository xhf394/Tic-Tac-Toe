import React from 'react';
import ReactDOM from 'react-dom';
import chunk from 'lodash/chunk';
import './index.css';
// class Square extends React.Component {
//     render() {
//         return (
//             <button className="square" onClick={()=>this.props.onClick()}>
//                 {this.props.value}
//             </button>
//         );
//     }
// }

        const styles = [
        	{
        	    borderRightStyle: "solid",
        	    borderBottomStyle: "solid"
        	},
        	{
        		borderBottomStyle: "solid",
        	},
        	{
        		borderBottomStyle: "solid",
        		borderLeftStyle: "solid"
        	},
        	{
        		borderRightStyle: "solid"
        	},
        	{
             
        	},
        	{
        		borderLeftStyle: "solid"
        	},
        	{
        	    borderTopStyle: "solid",
        	    borderRightStyle: "solid"	
        	},
        	{
        		borderTopStyle: "solid"
        	},
        	{
        		borderTopStyle: "solid",
        		borderLeftStyle: "solid"
        	}
        ]

function Square(props){
    if(props.highlight){
        return (
            <button className="square winner-style" onClick={props.onClick} style={props.style} >
                {props.value}
            </button>
        );
    }
    else {
        return (
            <button className="square" onClick={props.onClick} style={props.style}>
                {props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    // constructor(){
    //     super();
    //     this.state ={
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     };
    // }

    renderSquare(i) {
        return (
            <Square
                key={i}
                index={i}
                value={this.props.squares[i]}
                onClick={()=> this.props.onclick(i)}
                highlight={this.props.winLine.includes(i)}
                style={styles[i]}
        />);
    }

    render() {

        //const winner = calculateWinner(this.state.squares);
        // let status;
        // if(winner){
        //     status = 'Winner: ' + winner;
        // }else{
        //     status = 'The next player: ' + (this.state.xIsNext ? 'X' : 'O')
        // }



        return (
            <div>
               {chunk(this.props.squares, 3).map((rows, rowsIndex) =>{
                   return (
                    <div className="board-row" key={rowsIndex}>
                   {rows.map((column, columnIndex)=>
                        this.renderSquare(rowsIndex * 3 + columnIndex)
                   )}
                   </div>
                )})}
            </div>
        )
    };
}

class StartGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startGame:false
        }
        this.startGameClick = this.startGameClick.bind(this);
    }

    startGameClick() {
        this.setState({
            startGame:true
        })
    }

    render() {

        if(!this.state.startGame) {
            return(
                <div>
                    <button className="startGame" onClick={this.startGameClick}>
                        Game Start!
                    </button>    
                </div>
            )  
        }
        else {
            return(
                <div></div>
            )
        }
        
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [
                {
                squares: Array(9).fill(null),
                historyStep: 'Game Start',
                }
            ],
        stepNumber: 0,
        xIsNext: true,
        isSortToggleOn: true,
        };

        this.sortClick = this.sortClick.bind(this);
        this.restartClick = this.restartClick.bind(this);
        this.goBackClick = this.goBackClick.bind(this);
    }

    sortClick() {
        this.setState(prevState => ({
            isSortToggleOn: !prevState.isSortToggleOn
        }));
    }

    restartClick() {
        //reset all the data
        this.setState(prevState => ({
            history: [
                {
                squares: Array(9).fill(null),
                historyStep: 'Game Start',
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            isSortToggleOn: true, 
        }))
    }
    
    goBackClick() {
        //soft copy history 
        const history = this.state.history.slice(0, this.state.stepNumber + 1);

        //roll back one step
        if(this.state.stepNumber){
            this.setState(prevState => ({
            history: history.slice(0, this.state.stepNumber),
            stepNumber: history.length-2,
            xIsNext: !this.state.xIsNext
        }))
        }
        
    }
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        //原本就有了一个空数组，history在浅备份时需要在stepNumber的基础上加1
        const current = history[history.length - 1];

        const squares = current.squares.slice();  //浅备份
        if(calculateWinner(squares).winner || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X': 'O';

        const location = '('+ (Math.floor(i/3) + 1) + ',' + (Math.floor(i%3) + 1) + ')';
        const desc = squares[i] + ' now moved to ' +  location ;
        this.setState({
            history: history.concat([
                {
                squares: squares,
                historyStep: desc,
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });

    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            //step: this.state.history.step,
        });
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares).winner;
        const winLine = calculateWinner(current.squares).line;

        const moves = history.map((step, move)=>{
              const desc = move ?
                  history[move].historyStep :
                'Game start';

            if (move === this.state.stepNumber) {
                return (<strong key={move}><li key={move}>
                    <button onClick={()=>this.jumpTo(move)} ><strong>{desc}</strong></button>
                </li></strong>)};
            return (
                <li key={move}>
                    <button onClick={()=>this.jumpTo(move)} history={this.state.history}>{desc}</button>
                </li>
            )
        })

        let status;
        if(winner){
            status = 'Winner is : ';
        }else{
            status = "The next player is : ";
        }

        //specify which one is the next turn or winner;
        let statusSpecification;
        if(winner){
        	statusSpecification = winner;
        }
        else{
        	statusSpecification = (this.state.xIsNext ? "X": "O");
        }


        const isSortToggleOn = this.state.isSortToggleOn;

        if(!isSortToggleOn) {
            moves.reverse();
        }

        return (

            <div>
                <StartGame />

                <div className="game">
                    <div className="game__turn">
                        <div>{status}</div> 
                        <div className="game-status-specification">{statusSpecification}</div>
                    </div>

                    <div className="game__board">
                        <Board
                        squares = {current.squares}
                        onclick ={(i)=> this.handleClick(i)}
                        winLine ={winLine}
                        />
                    </div>
                
                    <div className="game__control">
                	    <div>
                		    <button onClick={this.restartClick} className="btn">
                			    Restart
                		    </button>
                	    </div>

                	    <div>
                		    <button onClick={this.goBackClick} className="btn">
                			    Go Back
                		    </button>
                	    </div>
                    </div>

                
                
                    <div className="game__info">
                        <div>
                            <button onClick={this.sortClick}>
                                {this.state.isSortToggleOn ? 'Unsort' : 'Sort'}
                            </button>
                        </div>
                        <ul>{/* TODO */moves}</ul>
                    </div>
                </div>    
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares){
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
    for(let i = 0; i < lines.length; i++ ){
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){
            console.log(lines[i]);
            return {winner: squares[a], line: [a, b, c]};
        }
    }
    return {winner: null, line: []};
}

