module.exports = [
  {
    method: "PUT",
    path: "/publish",
    handler: "publish.publishIds",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "PUT",
    path: "/unpublish",
    handler: "publish.unpublishIds",
    config: {
      policies: [],
      auth: false,
    },
  },
];
