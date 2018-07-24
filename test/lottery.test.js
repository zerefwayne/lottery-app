const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const {
    interface,
    bytecode
} = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });
});

describe('Lottery Contract', () => {

    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows an account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('1.2', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

       

        assert.equal(accounts[1], players[0]);
        assert.equal(1, players.length);
    });

    
    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('1.2', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('3', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('4', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[1], players[0]);
        assert.equal(accounts[2], players[1]);
        assert.equal(accounts[3], players[2]);

        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether to enter', async () => {
        try {

            await lottery.methods.enter().send({
                from: accounts[0],
                value: 10
            });

            assert(false);

        } catch (err) {

            assert(err);
        
        }
    });

    it('only manager can call pick winner', async() => {

        try {

            await lottery.methods.pickWinner().send({
                from:accounts[1]
            });

            assert(false);

        } catch(err) {

            assert(err);

        }

    });

    it('sends money to winner, resets array', async () => {

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[1]);
        
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[1]);

        console.log(finalBalance - initialBalance);

        console.log(players);

        
    });

});