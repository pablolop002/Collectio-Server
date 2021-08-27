"use strict";

// Load modules
const express = require("express");
const fs = require("fs-extra");
const i18n = require("i18n");
const multer = require("multer");
const path = require("path");

// Config
const database = require("../../config/databases");
const collectionImages = multer({
  storage: multer.diskStorage({
    destination: (request, file, callback) => {
      let dest = path.join(
        __basedir,
        "storage",
        "images",
        "user" + request.user.Id,
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

// Function instances
const daoCollections = new DAOCollections(database.pool);

// Router
const collectionsApi = express.Router();

collectionsApi.get("/", function (request, response, next) {
  let user =
    request.query.others && request.query.others === "true"
      ? null
      : request.user.Id;
  let category = request.query.categoryId ? request.query.categoryId : null;
  let collection = request.query.collectionServerId
    ? request.query.collectionServerId
    : null;
  let withChildren = request.query.withChildren
    ? request.query.withChildren
    : "false";
  let syncDate = request.query.lastSync ? request.query.lastSync : null;

  if (withChildren === "false") {
    daoCollections.getCollections(
      user,
      category,
      collection,
      syncDate,
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
    daoCollections.getCollectionsWithChildren(
      user,
      category,
      collection,
      function (err, data) {
        if (err) {
          next(err);
        } else {
          data = data.reduce((accumulator, current) => {
            let col = accumulator.findIndex(
              (collection) => collection.ServerId === current.ServerCollectionId
            );
            if (col === -1 || col === accumulator.length) {
              let collection = {
                ServerId: current.ServerCollectionId,
                CategoryId: current.CategoryId,
                UserServerId: current.UserId,
                Name: current.CollectionName,
                Description: current.CollectionDescription,
                Image: current.CollectionImage,
                Private: current.CollectionPrivate,
                CreatedAt: current.CollectionCreatedAt,
                UpdatedAt: current.CollectionUpdatedAt,
                Items: [],
              };

              if (current.ServerItemId != null) {
                collection.Items.push({
                  ServerId: current.ServerItemId,
                  CollectionServerId: current.ServerCollectionId,
                  UserServerId: collection.UserServerId,
                  SubcategoryId: current.SubcategoryId,
                  Name: current.ItemName,
                  Description: current.ItemDescription,
                  CreatedAt: current.ItemCreatedAt,
                  UpdatedAt: current.ItemUpdatedAt,
                  Private: current.ItemPrivate,
                  Images: [],
                });

                if (current.ServerItemImageId != null) {
                  collection.Items[0].Images.push({
                    ServerId: current.ServerItemImageId,
                    ItemServerId: current.ServerItemId,
                    CollectionServerId: collection.ServerId,
                    UserServerId: collection.UserServerId,
                    Image: current.ItemImage,
                  });
                }
              }

              accumulator.push(collection);
            } else {
              let item = accumulator[col].Items.findIndex(
                (item) => item.ServerId === current.ServerItemId
              );
              if (item === -1 || item === accumulator[col].Items.length) {
                let item = {
                  ServerId: current.ServerItemId,
                  UserServerId: accumulator[col].UserServerId,
                  CollectionServerId: current.ServerCollectionId,
                  SubcategoryId: current.SubcategoryId,
                  Name: current.ItemName,
                  Description: current.ItemDescription,
                  CreatedAt: current.ItemCreatedAt,
                  UpdatedAt: current.ItemUpdatedAt,
                  Private: current.ItemPrivate,
                  Images: [],
                };

                if (current.ServerItemImageId != null) {
                  item.Images.push({
                    ServerId: current.ServerItemImageId,
                    UserServerId: accumulator[col].UserServerId,
                    CollectionServerId: item.CollectionServerId,
                    ItemServerId: current.ServerItemId,
                    Image: current.ItemImage,
                  });
                }

                accumulator[col].Items.push(item);
              } else {
                accumulator[col].Items[item].Images.push({
                  ServerId: current.ServerItemImageId,
                  UserServerId: accumulator[col].Items[item].UserServerId,
                  CollectionServerId:
                    accumulator[col].Items[item].CollectionServerId,
                  ItemServerId: current.ServerItemId,
                  Image: current.ItemImage,
                });
              }
            }

            return accumulator;
          }, []);

          response.json({
            status: "ok",
            code: 1,
            data: data,
          });
        }
      }
    );
  }
});

collectionsApi.put(
  "/",
  collectionImages.single("Images"),
  function (request, response, next) {
    let collection = {
      CategoryId: request.body.CategoryId,
      UserId: request.user.Id,
      Name: request.body.Name,
      Description: request.body.Description,
      Image: request.file != null ? request.file.filename : null,
      Private: request.body.Private,
    };

    daoCollections.insertCollection(collection, function (err, collectionId) {
      if (err) {
        next(err);
      } else {
        if (request.file) {
          let finalPath = path.join(
            __basedir,
            "storage",
            "images",
            "user" + request.user.Id,
            "collection" + collectionId.insertId
          );
          fs.mkdirsSync(finalPath);
          fs.moveSync(
            request.file.path,
            path.join(finalPath, request.file.filename)
          );
        }
        response.json({
          status: "ok",
          code: 1,
          data: collectionId.insertId,
        });
      }
    });
  }
);

collectionsApi.post(
  "/",
  collectionImages.single("Images"),
  function (request, response, next) {
    if (!request.body.ServerId) {
      response.json({
        status: "ko",
        code: 2,
        message: i18n.__("noCollectionId"),
      });
    }

    daoCollections.getCollections(
      request.user.Id,
      null,
      request.body.ServerId,
      null,
      function (err, collections) {
        if (err) {
          next(err);
        } else {
          if (collections.length > 0) {
            let collection = collections[0];
            let oldImage = collection.Image;
            if (request.body.Name) collection.Name = request.body.Name;
            if (request.body.Description)
              collection.Description = request.body.Description;
            if (request.body.Private) collection.Private = request.body.Private;
            if (request.file && oldImage !== request.file.filename) {
              collection.Image = request.file.filename;
            } else {
              collection.Image = null;
              if (request.file) {
                fs.removeSync(request.file.path);
              }
            }

            daoCollections.updateCollection(collection, function (err, data) {
              if (err) {
                next(err);
              } else {
                if (collection.Image) {
                  let finalPath = path.join(
                    __basedir,
                    "storage",
                    "images",
                    "user" + request.user.Id,
                    "collection" + collection.ServerId
                  );

                  fs.mkdirsSync(finalPath);

                  fs.moveSync(
                    request.file.path,
                    path.join(finalPath, request.file.filename)
                  );

                  if (oldImage) {
                    fs.removeSync(
                      path.join(
                        __basedir,
                        "storage",
                        "images",
                        "user" + request.user.Id,
                        "collection" + collection.ServerId,
                        oldImage
                      )
                    );
                  }
                }
                response.json({
                  status: "ok",
                  code: 1,
                  //message: _(''),
                  data: collection.ServerId,
                });
              }
            });
          }
        }
      }
    );
  }
);

collectionsApi.delete(
  "/:id",
  collectionImages.none(),
  function (request, response, next) {
    if (request.params.id) {
      daoCollections.deleteCollection(
        request.params.id,
        request.user.Id,
        function (err, data) {
          if (err) {
            next(err);
          } else {
            if (data.affectedRows > 0) {
              fs.removeSync(
                path.join(
                  __basedir,
                  "storage",
                  "images",
                  "user" + request.user.Id,
                  "collection" + request.params.id
                )
              );

              response.json({
                status: "ok",
                code: 1,
                message: i18n.__("collectionDeleted"),
              });
            } else {
              response.json({
                status: "ko",
                code: 2,
                message: i18n.__("collectionNotOwned"),
              });
            }
          }
        }
      );
    } else {
      response.json({
        status: "ko",
        code: 2,
        message: i18n.__("noCollectionId"),
      });
    }
  }
);

module.exports = collectionsApi;
