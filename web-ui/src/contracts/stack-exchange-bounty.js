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
        "name": "contractAddress",
        "type": "address"
      },
      {
        "name": "site",
        "type": "string"
      },
      {
        "name": "questionID",
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
    "constant": true,
    "inputs": [
      {
        "name": "_i",
        "type": "uint256"
      },
      {
        "name": "_sponsorAddr",
        "type": "address"
      }
    ],
    "name": "getSponsorBalance",
    "outputs": [
      {
        "name": "sponsorBalance",
        "type": "uint256"
      }
    ],
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
        "name": "_i",
        "type": "uint256"
      }
    ],
    "name": "increaseBounty",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "contractBalance",
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
    "constant": true,
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
    "name": "getAddressOfQuestion",
    "outputs": [
      {
        "name": "questionAddr",
        "type": "address"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_i",
        "type": "uint256"
      }
    ],
    "name": "getSponsors",
    "outputs": [
      {
        "name": "sponsorList",
        "type": "address[]"
      }
    ],
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
    "inputs": [],
    "name": "BountyIncreased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
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
  numberOfQuestions: function() {
    return this.app.web3.toDecimal(this.app.web3.eth.getStorageAt(this.address, 3));
  },
  question: function(index) {
    var question = this.contract.questions(index);
    return {
      contractAddress: question[0],
      site: question[1],
      id: question[2],
      winnerAddress: question[3],
      winnerID: question[4],
      acceptedAnswerID: question[5],
      updateDelay: question[6],
      expiryDate: parseInt(question[7]),
      ownedFee: question[8]
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
      value: this.app.web3.toWei(bounty, 'ether'),
      gasLimit: '0x100000',
      gasPrice: '0x' + gasPrice.toString(16),
      data: data
    });
    tx.sign(new Buffer(pkey.substr(2), 'hex'));
    
    return this.app.web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'));
  }
};

module.exports = StackExchangeBounty;