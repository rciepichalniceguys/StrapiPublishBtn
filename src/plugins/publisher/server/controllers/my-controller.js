'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('publisher')
      .service('myService')
      .getWelcomeMessage();
  },
});
