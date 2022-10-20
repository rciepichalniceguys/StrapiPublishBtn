'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('categorybtn')
      .service('myService')
      .getWelcomeMessage();
  },
});
