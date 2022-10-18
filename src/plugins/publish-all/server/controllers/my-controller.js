'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('publish-all')
      .service('myService')
      .getWelcomeMessage();
  },
});
