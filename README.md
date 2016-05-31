# StackExchange Bounty ÐApp

The StackExchange ÐApp is composed by a front-end written in CSS/JS situated in the web-ui folder and by the StackExchangeBounty.sol, which is an Ethereum smart contract written in Solidity.

The StackExchange Bounty ÐApp enables users to deposit bounties over StackExchange questions. Oraclize will then query once a day StackExchange APIs and update the contract data. When the initial user, the one asking the question in first place, selects one of the answer as the most satisfactory one, the contract will pay the bounty to the owner of the selected answer, called *winner* in the contract code. The bounty can be send only if the *winner* has an Ethereum address in the location field on his StackExchange subsite profile. If no address is found, Oraclize will keep querying for that address once a day until the question's expiration date. After that date, if there is no selected answer nor a destination address, the bounty will be returned to its owner.

The users on SE will provide their Ethereum address on the location data field and the deserved bounty will be paied to that address.

This application is a simplified version of https://github.com/oraclize/dapp-stackexchange-bounty.

## How to run the application in Ethereum Studio

First of all, you need the project in your workspace directory:
```
# git clone https://github.com/ether-camp/dapp-stackexchange-bounty.git
```

We will use a sandbox as a backend of the application to watch state of the contract and test its workflow. Select the project in Workspace panel and click "Run All Contracts" to start a new sandbox. You will see the following contracts on Sandbox panel:
* `StackExchangeBounty` - the main contract of the application, its source code is in `contracts` directory;
* `NameReg` - name registrar, it helps to get an address of `StackExchangeBounty` by its name;
* `**Oraclize Address Resolver**` - this contract provides an address of `OraclizeAPI` contract.
* Other oraclize contracts.

Oraclize address resolver has different address on each network:
* test: 0x20e12a1f859b3feae5fb2a0a32c18f5a65555bbf
* live: 0x1d11e5eae3112dbd44f99266872ff1d07c77dce8
* morden: 0x0ae06d5934fd75d214951eb96633fbd7f9262a7c

IDE has Oraclize plugin parameters in `ethereum.json` to define at what address it will be created in the sandbox:
```
  "plugins": {
    "oraclize": {
      "networkID": 161,
      "loadRealData": true
    }
  },
```

`networkID` accepts: 1 for the live, 2 for he morden, and 161 for the test.

But your contract has to know OraclizeAPI address too. Oraclize has a method for it:
```
oraclize_setNetwork(networkID_consensys);
```

Which accepts: `networkID_mainnet` for the live, `networkID_consensys` for the test, and `networkID_morden` for the morden.

The web-app needs sandbox id to connect to it, so let's copy it to `web-ui/src/app.js`:
```
var sandboxId = 'b7dad637c6';
```

The web-app uses js-libraries (web3, ethereumjs-tx, etc) and it is intended to be built with `browserify`. `gulp` will do it for you:
```
# cd dapp-stackexchange-bounty
# npm install
# gulp
```

To rebuild automatically run:
```
# gulp watch
```

We are ready to start the web-app:
```
# npm install http-server -g
# http-server web-ui
```

It should be available on URL https://[your_username].by.ether.camp:8080.

Let's add a new bounty for a question: 
![New Question](http://image.prntscr.com/image/2d242d1bc72c4f4dac873b87ca245d2d.png)

You can use `cow` as a private key, we defined the account in `ethereum.json`:
```
"0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826": {
  "balance": "0x1000000000000000000000000000000000000",
  "nonce": "1430",
  "pkey": "cow",
  "default": false,
  "storage": {
    "0x0f": 200010,
    "0x01": "0x200001"
  }
},
```

Click "Add" and switch to Oraclize panel in your IDE:
![Oraclize Panel](http://image.prntscr.com/image/2f2b9e4930034c4ea310ce4321ef931b.png)

`StackExchangeBounty` asked for the question's creation date and for accepted answer. There is not accepted anwer for the question yet. So, the contract has scheduled a new call in a day.

Now, let's try to play a flow with a question which has an accepted answer. Switch oraclize to manual mode:
![Oraclize Panel](http://image.prntscr.com/image/cbd504f06c1b476ca9eff0368c1caa37.png)

Create a new bounty using another question and switch to Oraclize panel. It should be asking for a value to respond. Let's put some random values:
![Oraclize Panel](http://image.prntscr.com/image/b9241ed7284f49768b3a780b02760fe0.png)

And finally take a look at the account `0x630c57c4ac63621714412bf9a5eedda89ec01337`. It has got the reward!

## Project Structure

Directory `contracts` contains project's contracts. The main contract `StackExchangeBounty.sol` uses `oraclizeAPI.sol` and `std.sol`.

Directory `pre` contains `name_reg.sol` which is NameReg contract. It is created in the sandbox without a transaction on the address specified in `ethereum.json`:
```
"0x0860a8008298322a142c09b528207acb5ab7effc": {
  "balance": 1234567890123345,
  "source": "pre/name_reg.sol"
}
```

There is a NameReg on the same address in the test network.

Directory `web-ui/src` contains sources of the web-app. `app.js` is an entry point of the app.