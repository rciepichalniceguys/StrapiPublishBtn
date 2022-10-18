const { Strapi } = require("@strapi/strapi/lib/Strapi");

module.exports = {
  // https://crontab.guru/
  "*/2 * * * *": {
    task: async ({ strapi }) => {
      try {
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
        console.log(
          `Autopublish ran at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
        );

        await Promise.all(
          draftArticleToPublish.map((article) => {
            return strapi.entityService.update(
              "api::article.article",
              article.id,
              {
                data: {
                  publishedAt: new Date(),
                },
              }
            );
          })
        );
      } catch (e) {
        console.log(e);
      }
    },
    options: {
      tz: "Europe/Warsaw",
    },
  },
};
