## Introduction

This project was made for Strasbourg's Devfest 2022. The point is to show why and when blockchain
can be implemented instead of traditional REST API.

## Use

There is three type of contract available so far. A Shared wallet, a Crowdfunding and Common pot.
You can create X instance of each from the home page and share it with their address.

## Installation

Get the project on your computer
```sh
$ git clone https://github.com/GerschheimerDidier/DevFest2022.git
```
You will need a blockchain to deploy and run your smart contract.
We use ganache, just download and launch it.
```shell
$ https://trufflesuite.com/ganache/
```
Install needed libraries for web3 and deploy smart contracts.
```sh
$ cd truffle
$ npm install
$ truffle migrate -devlopment
```
Look for the address of WalletFactory in your console. Copy and paste it into constant FACTORY_ADDRESS in client/stc/setup-factory.js  
This will allow you to deploy smart contract and access them.

You also need a way to allow transaction between contracts and your navigator. You can use Metamask, it's a navigator extension.
```shell
$ https://metamask.io/
```
Once installed just go on your extension and import an account with the private key you have on one of your ganache's account.
You can see where your private key is by clicking the key item on the row of one of the account.

Now start the React server.
```sh
$ cd client
$ npm install
$ npm start
```
You now have access to everything and can start to toy with the app.



## Disclaimer

There's still some bug in the app, it was build as we discover the subject. It is not best practice guarantee, especially about ReactJS part.



