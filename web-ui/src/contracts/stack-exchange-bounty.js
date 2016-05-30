var _ = require('lodash');
var SolidityFunction = require('web3/lib/web3/function');
var ethTx = require('ethereumjs-tx');
var util = require('../util');

var abi = [
  {
    "constant": false,
    "inputs": [],
    "name": "nameRegAddress",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numQuestions",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "queryID",
        "type": "bytes32"
      },
      {
        "name": "result",
        "type": "string"
      }
    ],
    "name": "__callback",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "questions",
    "outputs": [
      {
        "name": "questionID",
        "type": "uint256"
      },
      {
        "name": "site",
        "type": "string"
      },
      {
        "name": "sponsor",
        "type": "address"
      },
      {
        "name": "bounty",
        "type": "uint256"
      },
      {
        "name": "winnerAddress",
        "type": "address"
      },
      {
        "name": "winnerID",
        "type": "uint256"
      },
      {
        "name": "acceptedAnswerID",
        "type": "uint256"
      },
      {
        "name": "updateDelay",
        "type": "uint256"
      },
      {
        "name": "expiryDate",
        "type": "uint256"
      },
      {
        "name": "ownedFee",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "kill",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_questionID",
        "type": "uint256"
      },
      {
        "name": "_site",
        "type": "string"
      }
    ],
    "name": "handleQuestion",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "name",
        "type": "bytes32"
      }
    ],
    "name": "named",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "changeOwner",
    "outputs": [],
    "type": "function"
  },
  {
    "inputs": [],
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "QuestionAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "BountyPaid",
    "type": "event"
  }
];

var StackExchangeBounty = {
  init: function(app, address) {
    this.app = app;
    this.address = address;
    this.contract = app.web3.eth.contract(abi).at(address);
    return this;
  },
  question: function(index) {
    var question = this.contract.questions(index);
    return {
      index: index,
      id: question[0],
      site: question[1],
      sponsor: question[2],
      bounty: question[3],
      winnerAddress: question[4],
      winnerID: question[5],
      acceptedAnswerID: question[6],
      updateDelay: question[7],
      expiryDate: parseInt(question[8]),
      ownedFee: question[9]
    };
  },
  handleQuestion: function(id, site, bounty, pkey) {
    var func = new SolidityFunction(this.app.web3, _.find(abi, { name: 'handleQuestion' }), '');
    var data = func.toPayload([ id, site ]).data;
    
    var address = util.toAddress(pkey);
    
    var nonce = this.app.web3.eth.getTransactionCount(address);
    var gasPrice = this.app.web3.eth.gasPrice;

    var tx = new ethTx({
      to: this.address,
      nonce: nonce,
      value: parseInt(this.app.web3.toWei(bounty, 'ether')),
      gasLimit: '0x100000',
      gasPrice: '0x' + gasPrice.toString(16),
      data: data
    });
    tx.sign(new Buffer(pkey.substr(2), 'hex'));
    
    return this.app.web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'));
  }
};

module.exports = StackExchangeBounty;