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
            {list} 
          </div>
        </div>//
    )
  }
}

function applyRule(neighbors, rule)
{

  if( !Array.isArray(neighbors) || neighbors.length !== 3 )
  {
    return false;
  }

  // Rule 27 = 16 + 8 + 2 + 1 
  // 0 0 0 1 1 0 1 1
  // 
  // Rule 90 = 0 1 0 1 1 0 1 0
  const neighborNum = neighbors[0] * 4 + neighbors[1] * 2 + neighbors[2];
  //0 + 0 + 1 = 1 
  //2 ^ 0 = 1
  
  const match = Math.pow( 2, neighborNum ) & rule;
  console.log("ApplyRule: " , neighborNum, Math.pow(2, neighborNum), rule, match);
  return match ? true : false ;
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
    };

    //check rules
    
   //console.log("Rule #" + this.props.rule);

  }

  advance(){

    const history = this.state.history;
    const current = history[history.length - 1];
    const oldSquares = current.squares;
    //console.log(oldSquares);

    const newSquares = oldSquares.map( (x, index) => {
      
      if( index === 0 || index  === this.props.width - 1 ){
        return false;
      }

      var neighbors = [ oldSquares[index - 1], oldSquares[index], oldSquares[index+1] ];
      //console.log(neighbors);
      var newVal = applyRule( neighbors, this.state.rule );
      
      //console.log(x, index, newVal);

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

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];

    return (
      <div className="game mt-10 container mx-auto">
          <div className="controls flex flex-row bg-gray-200"> 
            <RuleInput value={this.state.rule} onChange={ this.newRule.bind(this) } />
            <div className="status py-2 px-4 m-2">Step: {this.state.frame}</div>
            <Advancer onClick={() => this.advance()} />
          </div>
        <div className="game-board">
          <Board squares={ current.squares } />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>//
    );
  }
}

// ========================================
// Rule 27 = 16 + 8 + 2 + 1 
// 0 0 0 1 1 0 1 1
ReactDOM.render(
  <Game width={50} rule={90} />,
  document.getElementById('root')
);

