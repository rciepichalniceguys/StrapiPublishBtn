"use strict";

module.exports = ({ strapi }) => ({
  async publishIds(ctx) {
    try {
      return await strapi
        .plugin("publisher")
        .service("publishService")
        .publishIds(ctx);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async unpublishIds(ctx) {
    try {
      return await strapi
        .plugin("publisher")
        .service("publishService")
        .unpublishIds(ctx);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});
