var EventEmitter = require('events');
var Web3 = require('web3');
var NameReg = require('./contracts/name-reg');
var StackExchangeBounty = require('./contracts/stack-exchange-bounty');
var Help = require('./ui/help');
var QuestionsList = require('./ui/questions-list');
var AddQuestion = require('./ui/add-question');

var sandboxId = '50cbac27c6';
var url = '//' + window.location.hostname + ':8555/sandbox/' + sandboxId;

//var nameRegAddress = '0x084f6a99003dae6d3906664fdbf43dd09930d0e3'; // livenet
var nameRegAddress = '0x0860a8008298322a142c09b528207acb5ab7effc'; // testnet

$(function() {
  var app = new EventEmitter();
  app.net = 'sandbox';
  app.web3 = new Web3(new Web3.providers.HttpProvider(url));
  app.nameReg = NameReg.create(app.web3, nameRegAddress);
  
  var help = new Help($('#helpToast'));
  help.show();
  
  var address = app.nameReg.addressOf('StackExchangeBounty');
  app.contract = Object.create(StackExchangeBounty).init(app, address);
  app.questionsList = Object.create(QuestionsList).init(app, $('#questionsListContainer'));
  app.addQuestion = Object.create(AddQuestion).init(app, $('#addQuestion'));
});