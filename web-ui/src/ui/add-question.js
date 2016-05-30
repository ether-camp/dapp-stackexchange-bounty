var util = require('../util');

var AddQuestion = {
  init: function(app, $el) {
    this.app = app;
    this.$el = $el;
    this.$url = $el.find('input[name=url]');
    this.$bounty = $el.find('input[name=bounty]');
    this.$pkey = $el.find('input[name=pkey]');
    $el.find('#addQuestionForm').submit(this.add.bind(this));
    $el.on('show.bs.modal', (function() {
      this.reset();
      this.$url.focus();
    }).bind(this));
    return this;
  },
  reset: function() {
    this.$url.val('');
    this.$bounty.val('1');
    this.$pkey.val('');
  },
  add: function(e) {
    e.preventDefault();
    
    var url = this.$url.val();
    var site = url.match("://(.*).stackexchange")[1];
    var id = url.match("stackexchange.com/questions/(.*)/")[1];
    var bounty = this.$bounty.val();
    var pkey = this.$pkey.val();
    if (!util.isPkey(pkey)) pkey = util.sha3(pkey);
    
    this.app.contract.handleQuestion(id, site, bounty, pkey);
    this.hide();
  },
  hide: function() {
    this.$el.modal('hide');
  }
};

module.exports = AddQuestion;