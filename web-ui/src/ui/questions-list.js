var _ = require('lodash');

var QuestionsList = {
  init: function(app, $el) {
    this.app = app;
    $el.find('#loadingQuestions').hide();
    $el.find('#questionsListWrapper').show();
    this.$list = $el.find('#questionsList');
    this.tmpl = _.template($('#questionTmpl').html());
    this.showAll();
    this.app.contract.contract.QuestionAdded((function(err, result) {
      this.add(result.args.index);
    }).bind(this));
    this.app.contract.contract.BountyPaid((function(err, result) {
      var $question = this.$list.find('[data-index=' + result.args.index.toNumber() + ']');
      console.log($question);
      $question.find('[data-name=text]').text('Status:');
      $question.find('[data-name=info]').text('Completed');
    }).bind(this));
  },
  showAll: function() {
    var num = this.app.contract.contract.numQuestions().toNumber();
    for (var i = 0; i < num; i++) this.add(i);
  },
  add: function(index) {
    var question = this.app.contract.question(index);
    $.ajax({
      url: "https://api.stackexchange.com/2.2/questions/" + question.id + "?site=" + question.site,
      type: "GET",
      crossDomain: true,
      dataType: "json",
      success: (function (resp) {
        if (resp['error_id'] == 400) {
          return;
        }
        question.title = resp['items'][0]['title'];
        
        var nowUnix = new Date().getTime()/1000;

        if (question.winnerAddress == '0x0000000000000000000000000000000000000000' && nowUnix < question.expiryDate) {
          question.text = 'Expiry Date:';
          question.info = new Date(question.expiryDate*1000).toLocaleDateString();
        } else if (question.winnerAddress != '0x0000000000000000000000000000000000000000') {
          question.text = 'Status:';
          question.info = 'Completed';
        } else {
          question.text = 'Status:';
          question.info = 'Expired';
        }
        
        this.draw(question);
      }).bind(this),
      error: function (xhr, status) {
        if (xhr.responseJSON['error_name']=="throttle_violation") { 
          alert("Your IP was temporary banned by Stackexchange API "+xhr.responseJSON['error_message']);
        }
      }
    });
  },
  draw: function(question) {
    question.bounty = parseFloat(this.app.web3.fromWei(question.bounty, 'ether')).toFixed(2);
    this.$list.append(this.tmpl(question));
  }
};

module.exports = QuestionsList;