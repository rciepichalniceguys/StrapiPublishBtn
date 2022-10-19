module.exports = [
  {
    method: "GET",
    path: "/",
    handler: "myController.index",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/publishall",
    handler: "publish.publisher",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/publish/:id",
    handler: "publish.publishIds",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/unpublish/:id",
    handler: "publish.unpublishIds",
    config: {
      policies: [],
      auth: false,
    },
  },
];
