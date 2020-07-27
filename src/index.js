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

  renderSquare(row, col) {
    var index = row * this.props.width + col;
    return (
    	<Square key={ index.toString() }
    		value={this.props.squares[row][col]} 
    	/>//
    );
  }

  renderRow(row) {
    const list = this.props.squares[row].map((value, index) => {
      return this.renderSquare(row, index);
     });
       
        return (
          <div key={ row } className={ "row row-" + row + " h-5"}>
          { list }
          </div>//
        );
  }

  render() {
    
    const rows = this.props.squares.map( (row, index)  => {
        return this.renderRow( index );
    });

    return (
        <div className="board">
          <div className="rowList flex flex-col justify-center">
            { rows } 
          </div>
        </div>//
    )
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    var height = this.props.height ?? 1;
    var squares = Array(height).fill(false).map( row => new Array(props.width).fill(false) ); 
    
    if ( this.props.start === "center" ) {
      squares[height / 2 ][props.width / 2] = true; //.fill(true, props.width / 2, props.width / 2 + 1)
    }

    this.state = {
      squares: squares,
      history: [{
        squares: squares
      }],
      frame: 0,
      rule: this.props.rule,
      wrap: this.props.wrap,
      multiline: this.props.multiline,
      width: this.props.width,
      height: this.props.height
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
    return match ? true : false;
  }

  advance1d(){

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

  advance2d(){
    const history = this.state.history;
    const current = history[history.length - 1];
    const oldSquares = current.squares;

    const newSquares = oldSquares.map ( (row, index) => {
      row.map( ( col, colIndex) => {
        //console.log(row, col);
        return this.applyRule
        
      });
    });


  }

  advance(){

   if(this.props.height && this.props.height > 1){
     this.advance2d();
   } else {
     this.advance1d();
   }

  }

  newRule( event ){
    this.setState({ rule: event.target.value });
  }

  renderBoard(i) {
    return (
      <Board squares={ i.squares } width={ this.props.width } />//
    );
  }

  render() {

    const history = this.state.history;
    const current = history[history.length - 1];

    var list;

    if(this.state.height ){
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
  <Game width={ 50 } height={50} rule={ 90 } wrap={ true } start={ "center" }/>,
  document.getElementById('root')
);

