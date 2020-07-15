import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <input type="checkBox" className="square" onClick={() =>
      	this.props.onClick()} checked={this.props.value} />
    );
  }
}

class Advancer extends React.Component {
	render() {
		return (
			<button className="advancer" onClick={ () => this.props.onClick() } >
			Advance
			</button>//
	  );
	}
}

class Board extends React.Component {
	constructor(props){
		super(props);
		this.state = {
      frame: 0,
      squares: Array(props.width).fill(false).fill(true, props.width / 2, props.width / 2 + 1),
		};
	}

	handleClick(i) {
		const squares = this.state.squares.slice();
		squares[i] = ! squares[i];
		this.setState({ squares: squares });
	}

  renderSquare(i) {
    return (
    	<Square key={i.toString()}
    		value={this.state.squares[i]} 
    		onClick={() => this.handleClick(i)}
    	/>
    );
  }

  advance(){
    this.setState((state, props) => ({ 
      frame: state.frame + 1,
    }));
  }

  render() {
    
    const list = this.state.squares.map((value, index) => {
              return this.renderSquare(index);
              });

    return (
        <div className="board">
          <div className="controls"> 
            <div className="status">{this.state.frame}</div><Advancer onClick={() => this.advance()} />
          </div>
           {list} 
        </div>
    )
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(props.width).fill(false).fill(true, props.width / 2, props.width / 2 + 1),
      }],
    };
  }
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];

    return (
      <div className="game">
        <div className="game-board">
          <Board width={this.props.width} />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game width={9} />,
  document.getElementById('root')
);

