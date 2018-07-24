const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'crystal shield sense fun estate notable wire gain opera scissors awesome flag',
    'https://rinkeby.infura.io/v3/3df342ddbf9d497f84e1a918fc4a75d0'
);

const web3 = new Web3(provider);
let lottery;


const deploy = async() => {

    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account: ', accounts[0]);

    lottery = await new web3.eth.Contract(JSON.parse(interface)).
        deploy({ data: '0x'+bytecode })
        .send({ from: accounts[0], gas:'1000000' });

    console.log(interface);
    console.log('Contract deployed to: ', lottery.options.address);
};

deploy();