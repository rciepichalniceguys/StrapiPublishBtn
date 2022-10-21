"use strict";

module.exports = ({ strapi }) => ({
  async publishIds(ctx) {
    const ids = ctx.request.body.data;
    const contentName = ctx.request.body.contentName;
    if (ids.length > 0) {
      ids.map(async (id) => {
        const articleToPublish = await strapi.entityService.findOne(
          contentName,
          id
        );
        return strapi.entityService.update(contentName, articleToPublish.id, {
          data: {
            publishedAt: new Date(),
          },
        });
      });
      return (ctx.response.status = 200);
    }
    return (ctx.response.status = 500);
  },

  async unpublishIds(ctx) {
    const ids = ctx.request.body.data;
    const contentName = ctx.request.body.contentName;
    if (ids.length > 0) {
      ids.map(async (id) => {
        const articleToPublish = await strapi.entityService.findOne(
          contentName,
          id
        );
        return strapi.entityService.update(contentName, articleToPublish.id, {
          data: {
            publishedAt: null,
          },
        });
      });
      return (ctx.response.status = 200);
    }
    return (ctx.response.status = 500);
  },
});
