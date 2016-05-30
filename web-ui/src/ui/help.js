function Help($element) {
  this.$toast = $element;
}

Help.prototype.show = function() {
  this.$toast.show().addClass('animated fadeIn');
};

module.exports = Help;