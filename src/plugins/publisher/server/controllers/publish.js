"use strict";

module.exports = ({ strapi }) => ({
  async publisher(ctx) {
    try {
      return await strapi
        .plugin("publisher")
        .service("publishService")
        .publishAll();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async publishIds(ctx) {
    try {
      return await strapi
        .plugin("publisher")
        .service("publishService")
        .publishIds(ctx.params.id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});
