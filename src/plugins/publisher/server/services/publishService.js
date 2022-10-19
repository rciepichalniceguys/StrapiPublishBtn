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
    // return `Autopublish ran at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
  },
  async publishIds(id) {
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
  },
});
