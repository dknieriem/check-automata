import React from 'react';
import ReactDOM from 'react-dom';

import './assets/main.css';

function Square(props) {
  return (
    <input type="checkBox" className="square w-5 h-5 rounded-none bg-white border-0" onClick={ props.onClick } checked={ props.value } disabled />
  );
}

class Advancer extends React.Component {
	render() {
		return (
			<button className="advancer py-2 px-4 m-2 bg-blue-300 rounded-md hover:bg-red-300 transition duration-500 focus:bg-red-500" onClick={ () => this.props.onClick() }>
			Advance
			</button>//
	  );
	}
}

class RuleInput extends React.Component {
  render() {
    return (
      <label className="py-2 px-4 m-2">Rule <input type="text" className="ruleInput w-10" value={this.props.value} onChange={this.props.onChange} />
      </label>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return (
    	<Square key={i.toString()}
    		value={this.props.squares[i]} 
    	/>//
    );
  }

  render() {
    
    const list = this.props.squares.map((value, index) => {
              return this.renderSquare(index);
              });

    return (
        <div className="board">
          <div className="boxList flex justify-center">
            { list } 
          </div>
        </div>//
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
      frame: 0,
      squares: Array(props.width).fill(false).fill(true, props.width / 2, props.width / 2 + 1),
      rule: this.props.rule,
      wrap: this.props.wrap,
      multiline: this.props.multiline
    };
  }

  applyRule(neighbors, rule){

    if( !Array.isArray(neighbors) || neighbors.length !== 3 )
    {
      return false;
    }

    // Rule 27 = 16 + 8 + 2 + 1 
    // Rule 90 = 0 1 0 1 1 0 1 0
    const neighborNum = neighbors[0] * 4 + neighbors[1] * 2 + neighbors[2];
    
    const match = Math.pow( 2, neighborNum ) & rule;
    //console.log("ApplyRule: " , neighborNum, Math.pow(2, neighborNum), rule, match);
    return match ? true : false ;
  }

  advance(){

    const history = this.state.history;
    const current = history[history.length - 1];
    const oldSquares = current.squares;

    const newSquares = oldSquares.map( (x, index) => {
      
      var neighbors;

      if( index === 0 ){
        neighbors = [ false, oldSquares[index], oldSquares[index+1] ];
      } else if ( index  === this.props.width - 1 ){
        neighbors = [ oldSquares[index - 1], oldSquares[index], 0 ];
      } else {
        neighbors = [ oldSquares[index - 1], oldSquares[index], oldSquares[index+1] ];
      }

      var newVal = this.applyRule( neighbors, this.state.rule );

      return newVal;
       
    });
      

    this.setState((state, props) => ({ 
      frame: state.frame + 1,
      history: history.concat([{
        squares: newSquares,
      }]),
    }));

  }



  newRule( event ){
    this.setState({ rule: event.target.value });
  }

  renderBoard(i) {
    return (
      <Board squares={ i.squares } />//
    );
  }

  render() {

    const history = this.state.history;
    const current = history[history.length - 1];

    var list;

    if(this.state.multiline ){
      list = history.map((value, index) => {
                return this.renderBoard(value);
      });
    } else {
      list = this.renderBoard(current);
    }
    
    return (
      <div className="game mt-10 container mx-auto">
          <div className="controls flex flex-row bg-gray-200"> 
            <RuleInput value={this.state.rule} onChange={ this.newRule.bind(this) } />
            <div className="status py-2 px-4 m-2">Step: {this.state.frame}</div>
            <Advancer onClick={() => this.advance()} />
          </div>
        <div className="game-board">
          { list }
        </div>
      </div>//
    );
  }
}

ReactDOM.render(
  <Game width={ 50 } rule={ 90 } wrap={ true } multiline={ true } />,
  document.getElementById('root')
);

