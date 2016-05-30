var util = require('../util');

var AddQuestion = {
  init: function(app, $el) {
    this.app = app;
    this.$el = $el;
    $el.find('#addQuestionForm').submit(this.add.bind(this));
    return this;
  },
  add: function(e) {
    e.preventDefault();
    
    var url = this.$el.find('input[name=url]').val();
    var site = url.match("://(.*).stackexchange")[1];
    var id = url.match("stackexchange.com/questions/(.*)/")[1];
    var bounty = this.$el.find('input[name=bounty]').val();
    var pkey = this.$el.find('input[name=pkey]').val();
    if (!util.isPkey(pkey)) pkey = util.sha3(pkey);
    
    this.app.contract.handleQuestion(id, site, bounty, pkey);
    this.hide();
  },
  hide: function() {
    this.$el.modal('hide');
  }
};

module.exports = AddQuestion;