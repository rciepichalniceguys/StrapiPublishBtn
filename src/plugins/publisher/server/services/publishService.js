"use strict";

module.exports = ({ strapi }) => ({
  async publishAll() {
    const draftArticleToPublish = await strapi.entityService.findMany(
      "api::article.article",
      {
        filters: {
          publishedAt: { $null: true },
          publish_at: { $lt: new Date() },
        },
        publicationState: "preview",
      }
    );
    await Promise.all(
      draftArticleToPublish.map((article) => {
        return strapi.entityService.update("api::article.article", article.id, {
          data: {
            publishedAt: new Date(),
          },
        });
      })
    );
  },
  async publishIds(ctx) {
    const ids = ctx.request.body.data;
    console.log("Published:", ids);
    if (ids.length > 0) {
      ids.map(async (id) => {
        const articleToPublish = await strapi.entityService.findOne(
          "api::article.article",
          id
        );
        return strapi.entityService.update(
          "api::article.article",
          articleToPublish.id,
          {
            data: {
              publishedAt: new Date(),
            },
          }
        );
      });
      return (ctx.response.status = 200);
    }
    return (ctx.response.status = 500);
  },

  async unpublishIds(ctx) {
    const ids = ctx.request.body.data;
    console.log("Unpublished:", ids);
    if (ids.length > 0) {
      ids.map(async (id) => {
        const articleToPublish = await strapi.entityService.findOne(
          "api::article.article",
          id
        );
        return strapi.entityService.update(
          "api::article.article",
          articleToPublish.id,
          {
            data: {
              publishedAt: null,
            },
          }
        );
      });
      return (ctx.response.status = 200);
    }
    return (ctx.response.status = 500);
  },
});
