module.exports = {
  init: function() {
    return function(req, res, next) {
      req.user = req.user || {
          name: 'Davide',
          email: 'davide.molin@gmail.com'
        };
      next();
    };
  }
};
