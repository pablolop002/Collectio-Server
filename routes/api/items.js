"use strict";

// Load modules
const express = require("express");
const fs = require("fs-extra");
const i18n = require("i18n");
const multer = require("multer");
const path = require("path");

// Config
const database = require("../../config/databases");
const itemImages = multer({
  storage: multer.diskStorage({
    destination: (request, file, callback) => {
      let dest = path.join(
        __basedir,
        "storage",
        "images",
        "user" + request.user.Id,
        //"collection" + request.collection.Id,
        "temp"
      );
      fs.mkdirsSync(dest);
      callback(null, dest);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error(i18n.__("fileFormatNotValid")), false);
      }
    },
  }),
});

// Function includes
const DAOCollections = require("../../repositories/DAOCollections");
const DAOItems = require("../../repositories/DAOItems");

// Function instances
const daoCollections = new DAOCollections(database.pool);
const daoItems = new DAOItems(database.pool);

// Router
const itemsApi = express.Router();

itemsApi.get("/", function (request, response, next) {
  let user = request.query.others ? null : request.user.Id;
  let collection = request.query.collection ? request.query.collection : null;
  let item = request.query.item ? request.query.item : null;
  let withChildren = request.query.withChildren
    ? request.query.withChildren
    : null;

  if (collection == null) {
    if (item != null) {
      if (withChildren == null || withChildren === false) {
        daoItems.getItem(item, user, function (err, data) {
          if (err) {
            next(err);
          } else {
            response.json({
              status: "ok",
              code: 1,
              data: data,
            });
          }
        });
      } else {
        daoItems.getItemWithChildren(item, user, function (err, data) {
          if (err) {
            next(err);
          } else {
            response.json({
              status: "ok",
              code: 1,
              data: data,
            });
          }
        });
      }
    } else {
      next(new Error(i18n.__("noCollectionOrItemId")));
    }
  } else {
    if (withChildren == null) {
      daoItems.getAllItemsFromCollection(
        collection,
        user,
        function (err, data) {
          if (err) {
            next(err);
          } else {
            response.json({
              status: "ok",
              code: 1,
              data: data,
            });
          }
        }
      );
    } else {
      daoItems.getAllItemsFromCollectionWithChildren(
        collection,
        user,
        function (err, data) {
          if (err) {
            next(err);
          } else {
            response.json({
              status: "ok",
              code: 1,
              data: data,
            });
          }
        }
      );
    }
  }
});

itemsApi.put(
  "/",
  itemImages.array("Images", 6),
  function (request, response, next) {
    if (request.body.CollectionId) {
      daoCollections.getCollections(
        request.user.Id,
        null,
        request.body.CollectionId,
        function (err, collectionCheck) {
          if (err) {
            next(err);
          } else {
            if (collectionCheck != null && collectionCheck[0]) {
              let item = {
                CollectionId: request.body.CollectionId,
              };

              if (request.body.Name) item.Name = request.body.Name;
              if (request.body.Desription)
                item.Desription = request.body.Desription;
              if (request.body.Private) item.Private = request.body.Private;

              daoItems.addItem(item, function (err, response) {
                if (err) {
                  next(err);
                } else {
                  let ids = {
                    item: response.insertId,
                  };

                  request.files.forEach((elem, index, array) => {
                    let itemImage = {
                      ItemId: response.insertId,
                      Image: elem.filename,
                    };

                    daoItems.addItemImage(itemImage, function (err, res) {
                      if (err) {
                        fs.removeSync(elem.path);
                      } else {
                        let finalPath = path.join(
                          __basedir,
                          "storage",
                          "images",
                          "user" + request.user.Id,
                          "collection" + request.collection.Id,
                          "item" + response.insertId,
                          elem.filename
                        );
                        itemImage[elem.filename] = res.insertId;
                        fs.moveSync(elem.path, finalPath);
                      }
                    });
                  });

                  response.json({
                    status: "ok",
                    code: 1,
                    data: ids,
                  });
                }
              });
            } else {
              next(new Error(i18n.__("collectionNotOwned")));
            }
          }
        }
      );
    } else {
      next(new Error(i18n.__("noCollectionId")));
    }
  }
);

itemsApi.post("/", itemImages.none(), function (request, response, next) {
  if (request.body.ItemId) {
    daoItems.getItem(
      request.body.ItemId,
      request.user.Id,
      function (err, itemCheck) {
        if (err) {
          next(err);
        } else {
          if (itemCheck != null && itemCheck[0]) {
            let item = {
              Id: request.body.ServerId,
              CollectionId: request.body.CollectionId,
            };

            if (request.body.Name) item.Name = request.body.Name;
            if (request.body.Desription)
              item.Desription = request.body.Desription;
            if (request.body.Private) item.Private = request.body.Private;

            daoItems.updateItem(item, function (err, item) {
              if (err) {
                next(err);
              } else {
                response.json({
                  //ToDo: Edit item
                });
              }
            });
          } else {
            next(new Error(i18n.__("itemNotOwned")));
          }
        }
      }
    );
  } else {
    next(new Error(i18n.__("noItemId")));
  }
});

itemsApi.delete("/:id", itemImages.none(), function (request, response, next) {
  if (request.params.id) {
    daoItems.getItem(
      request.params.id,
      request.user.Id,
      function (err, itemCheck) {
        if (err) {
          next(err);
        } else {
          if (itemCheck != null && itemCheck[0]) {
            daoItems.deleteItem(request.params.id, function (err, data) {
              if (err) {
                next(err);
              } else {
                response.json({
                  status: "ok",
                  code: 1,
                });
              }
            });
          } else {
            next(new Error(i18n.__("itemNotOwned")));
          }
        }
      }
    );
  } else {
    next(new Error(i18n.__("noItemId")));
  }
});

itemsApi.get("/images/", function (request, response, next) {
  if (request.body.ItemId) {
    daoItems.getItem(
      request.body.ItemId,
      request.user.Id,
      function (err, itemCheck) {
        if (err) {
          next(err);
        } else {
          if (itemCheck != null && itemCheck[0]) {
            daoItems.getItemImages(request.body.ItemId, function (err, data) {
              if (err) {
                next(err);
              } else {
                response.json({
                  status: "ok",
                  code: 1,
                  message: data,
                });
              }
            });
          } else {
            next(new Error(i18n.__("itemNotOwned")));
          }
        }
      }
    );
  } else {
    next(new Error(i18n.__("noItemId")));
  }
});

itemsApi.put(
  "/images/",
  itemImages.array("Images", 6),
  function (request, response, next) {
    if (request.body.ItemId) {
      daoItems.getItem(
        request.body.ItemId,
        request.user.Id,
        function (err, itemCheck) {
          if (err) {
            next(err);
          } else {
            if (itemCheck != null && itemCheck[0]) {
              let destFolder = path.join(
                __basedir,
                "storage",
                "images",
                "user" + request.user.Id,
                "collection" + request.collection.Id,
                "item" + request.body.ItemId
              );
              request.files.forEach(function (item, index) {
                daoItems.addItemImage(
                  {
                    ItemId: request.body.ItemId,
                    Image: item.filename,
                  },
                  function (err, data) {
                    if (err) {
                      next(err);
                    }
                    fs.moveSync(
                      item.path,
                      path.join(destFolder, item.filename)
                    );
                  }
                );
              });
              request.body.ToRemove.forEach(function (item, index) {
                daoItems.deleteItemImage(item, function (err, image) {
                  if (err) {
                    next(err);
                  } else {
                    fs.removeSync(image);
                  }
                });
              });
              response.json({
                status: "ok",
                code: 1,
                message: i18n.__(""),
              });
            } else {
              next(new Error(i18n.__("itemNotOwned")));
            }
          }
        }
      );
    } else {
      next(new Error(i18n.__("noItemId")));
    }
  }
);

itemsApi.delete(
  "/images/:id",
  itemImages.none(),
  function (request, response, next) {
    if (request.body.ItemImageId) {
      daoItems.getItem(
        request.body.ItemImageId,
        request.user.Id,
        function (err, itemImageCheck) {
          if (err) {
            next(err);
          } else {
            if (itemImageCheck != null && itemImageCheck[0]) {
              daoItems.deleteItemImage(
                request.body.ItemImageId,
                function (err, data) {
                  if (err) {
                    next(err);
                  } else {
                    response.json({
                      status: "ok",
                      code: 1,
                      message: i18n.__("correctItemImageDeleted"),
                    });
                  }
                }
              );
            } else {
              next(new Error(i18n.__("itemNotOwned")));
            }
          }
        }
      );
    } else {
      next(new Error(i18n.__("noItemId")));
    }
  }
);

module.exports = itemsApi;
