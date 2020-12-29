const form = document.querySelector('form');
const ethValue = document.querySelector(".eth-value");
const formInput = document.querySelector('form input');
const d4ppBuy = document.querySelector('.d4pp-token-buy');

import { abi } from './abi/token.js';

const adminWallet = "0x902672CA5891067B5e157020B745Eb07d17591A6";

const TokenAddress = "0xcecc44fee8f0d4d2e5b958abe176b3781cc8f2e5";
let web3;
let Token;
let user;

const toWei = _amount => web3.utils.toWei(_amount.toString(), 'ether');

window.addEventListener('DOMContentLoaded', async () => {
    await loadWeb3();
    await loadBlockchainData(); 
})

const loadWeb3 = async () => {
    if(window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        // cancel autorefresh on network change
        window.ethereum.autoRefreshOnNetworkChange = false;

    } else if(window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        alert("Non-Ethereum browser detected. You should consider trying Metamask")
    }
}


const loadBlockchainData = async () => {
    let networkType;
    try {
        web3 = window.web3;
        networkType = await web3.eth.net.getNetworkType();
        if(networkType !== "main") {
            alert("Connect wallet to a main network");
            throw new Error();
        }

        Token = new web3.eth.Contract(abi, TokenAddress);
        const accounts = await web3.eth.getAccounts();
        user = accounts[0];
    } catch (error) {
        console.error(error);
        return error;
    }
}

formInput.addEventListener('change', e => {
    e.preventDefault();
    const input = e.currentTarget.value;
    if(isNaN(input)) return;

    const calcD4PPToken = Number(input) * 2.5;

    ethValue.textContent = `${Number(input).toFixed(2)} ETH`;
    d4ppBuy.textContent = `${calcD4PPToken.toFixed(2)} D4PP`;
    
})


form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const input = e.target.elements[0].value;
        if(isNaN(input)) return;
        const transactionObject = {
            from: user,
            to: adminWallet,
            value: toWei(input)
        }
        await web3.eth.sendTransaction(transactionObject);
        alert("Transaction successful");

    } catch (error) {
        alert("Error while trying to process transaction");
        return;
    }
})