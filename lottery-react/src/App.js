import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message:'',
    pickMessage:''
  };
  
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });

  }

  onSubmit = async (event) => {

    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: "Waiting on Transaction Success!"});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: "Transaction approved!"});

  };

  onClick = async () => {

    const accounts = await web3.eth.getAccounts();

    this.setState({pickMessage: "Waiting on transaction success!"});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ pickMessage: 'A Winner has been picked!'});
  };

  render() {
    return (
     <div>
      <div>
        <h2>Lottery Contract</h2>
        <hr />
        <p>This contract is managed by { this.state.manager }.</p>
        <p> There are currently { this.state.players.length } people entered in competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ethers!</p>
      </div>

      <hr />

      <form onSubmit = {this.onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of Ether to Enter</label>
          <input value = {this.state.value} onChange={event => this.setState({ value: event.target.value })} />

        </div>
        <button>Enter</button>
        <p>{this.state.message}</p>
      </form>

      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={this.onClick}>Pick Winner!</button>
      <p>{this.state.pickMessage}</p>
      </div>

    );
  }
}



export default App;
