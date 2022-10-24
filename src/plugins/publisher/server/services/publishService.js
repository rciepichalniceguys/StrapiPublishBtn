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
      ctx.type = "Application/json";
      if (ids.length === 1) {
        ctx.body = { message: "Item published.", status: 200 };
      }
      ctx.body = { message: "Items published.", status: 200 };
      return;
    }
    ctx.status = 500;
    ctx.type = "Application/json";
    ctx.body = { message: "Some problem occured." };
    return;
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
      ctx.type = "Application/json";
      if (ids.length === 1) {
        ctx.body = { message: "Item unpublished.", status: 200 };
      }
      ctx.body = { message: "Items unpublished.", status: 200 };
      return;
    }
    ctx.status = 500;
    ctx.type = "Application/json";
    ctx.body = { message: "Some problem occured." };
    return;
  },
});
