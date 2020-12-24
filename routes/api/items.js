"use strict";

// Load modules
const express = require('express');
const fs = require('fs-extra');
const i18n = require('i18n');
const multer = require('multer');
const path = require('path');

// Config
const database = require('../../config/databases');
const itemImages = multer({
    storage: multer.diskStorage({
        destination: (request, file, callback) => {
            let dest = path.join(__basedir, "storage", "images", "user" + request.user.Id, "collection" + request.collection.Id, "temp");
            fs.mkdirsSync(dest);
            callback(null, dest);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error(i18n.__('fileFormatNotValid')));
            }
        }
    })
});

// Function includes
const DAOCollections = require('../../repositories/DAOCollections');
const DAOItems = require('../../repositories/DAOItems');

// Function instances
const daoCollections = new DAOCollections(database.pool);
const daoItems = new DAOItems(database.pool);

// Router
const itemsApi = express.Router();

itemsApi.use(function (request, response, next) {
    if (request.query.collectionId) {
        daoCollections.getCollections(request.user.Id, null, request.query.collectionId, function (err, collection) {
            if (err) {
                next(err);
            } else {
                request.collection = {
                    'UserOwner': collection.length > 0,
                    'Id': request.query.collectionId,
                };

                if (request.method === 'post' && collection.length > 0) {
                    next();
                } else {
                    next(new Error(i18n.__('collectionNotOwned')));
                }
            }
        });
    } else {
        next(new Error(i18n.__('noCollectionId')));
    }
});

itemsApi.get('/', function (request, response, next) {
    let user = request.query.others ? null : request.user.Id;
    let collection = request.query.collection ? request.query.collection : null;
    let item = request.query.item ? request.query.item : null;
    let withChildren = request.query.withChildren ? request.query.withChildren : null;

    if (collection == null) {
        if (withChildren == null) {
            daoItems.getItem(item, user, function (err, data) {
                if (err) {
                    next(err);
                } else {
                    response.json({
                        'status': 'ok',
                        'code': 1,
                        'message': data
                    });
                }
            });
        } else {
            daoItems.getItemWithChildren(item, user, function (err, data) {
                if (err) {
                    next(err);
                } else {
                    response.json({
                        'status': 'ok',
                        'code': 1,
                        'message': data
                    });
                }
            });
        }
    } else {
        if (withChildren == null) {
            daoItems.getAllItemsFromCollection(collection, user, function (err, data) {
                if (err) {
                    next(err);
                } else {
                    response.json({
                        'status': 'ok',
                        'code': 1,
                        'message': data
                    });
                }
            });
        } else {
            daoItems.getAllItemsFromCollectionWithChildren(collection, user, function (err, data) {
                if (err) {
                    next(err);
                } else {
                    response.json({
                        'status': 'ok',
                        'code': 1,
                        'message': data
                    });
                }
            });
        }
    }
});

itemsApi.post('/', itemImages.array("Images", 6), function (request, response, next) {
    if (request.body.CollectionId) {
        daoCollections.getCollections(request.user.Id, null, request.body.CollectionId, function (err, collectionCheck) {
            if (err) {
                next(err);
            } else {
                if (collectionCheck != null && collectionCheck[0]) {
                    let item = {
                        'CollectionId': request.body.CollectionId
                    };

                    if (request.body.Name) item.Name = request.body.Name;
                    if (request.body.Desription) item.Desription = request.body.Desription;
                    if (request.body.Private) item.Private = request.body.Private;

                    //ToDo: Save new item
                } else {
                    next(new Error(i18n.__('collectionNotOwned')));
                }
            }
        });
    } else {
        next(new Error(i18n.__('noCollectionId')));
    }
});

itemsApi.post('/edit', itemImages.none(), function (request, response, next) {
    if (request.body.ItemId) {
        daoItems.getItem(request.body.ItemId, request.user.Id, function (err, itemCheck) {
            if (err) {
                next(err);
            } else {
                if (itemCheck != null && itemCheck[0]) {
                    let item = {
                        'Id': request.body.ServerId,
                        'CollectionId': request.body.CollectionId
                    };

                    if (request.body.Name) item.Name = request.body.Name;
                    if (request.body.Desription) item.Desription = request.body.Desription;
                    if (request.body.Private) item.Private = request.body.Private;

                    //ToDo: Edit item
                } else {
                    next(new Error(i18n.__('itemNotOwned')));
                }
            }
        });
    } else {
        next(new Error(i18n.__('noItemId')));
    }
});

itemsApi.post('/delete', itemImages.none(), function (request, response, next) {
    if (request.body.ItemId) {
        daoItems.getItem(request.body.ItemId, request.user.Id, function (err, itemCheck) {
            if (err) {
                next(err);
            } else {
                if (itemCheck != null && itemCheck[0]) {
                    daoItems.deleteItem(request.body.ItemId, function (err, data) {
                        if (err) {
                            next(err);
                        } else {
                            response.json({
                                'status': 'ok',
                                'code': 1,
                                'message': data
                            });
                        }
                    });
                } else {
                    next(new Error(i18n.__('itemNotOwned')));
                }
            }
        });
    } else {
        next(new Error(i18n.__('noItemId')));
    }
});

itemsApi.get('/images/', function (request, response, next) {
    if (request.body.ItemId) {
        daoItems.getItem(request.body.ItemId, request.user.Id, function (err, itemCheck) {
            if (err) {
                next(err);
            } else {
                if (itemCheck != null && itemCheck[0]) {
                    daoItems.getItemImages(request.body.ItemId, function (err, data) {
                        if (err) {
                            next(err);
                        } else {
                            response.json({
                                'status': 'ok',
                                'code': 1,
                                'message': data
                            });
                        }
                    });
                } else {
                    next(new Error(i18n.__('itemNotOwned')));
                }
            }
        });
    } else {
        next(new Error(i18n.__('noItemId')));
    }
});

itemsApi.post('/images/', itemImages.array("Images", 6), function (request, response, next) {
    if (request.body.ItemId) {
        daoItems.getItem(request.body.ItemId, request.user.Id, function (err, itemCheck) {
            if (err) {
                next(err);
            } else {
                if (itemCheck != null && itemCheck[0]) {
                    // ToDo: Save images
                } else {
                    next(new Error(i18n.__('itemNotOwned')));
                }
            }
        });
    } else {
        next(new Error(i18n.__('noItemId')));
    }
});

itemsApi.post('/images/delete', itemImages.none(), function (request, response, next) {
    if (request.body.ItemImageId) {
        daoItems.getItem(request.body.ItemImageId, request.user.Id, function (err, itemImageCheck) {
            if (err) {
                next(err);
            } else {
                if (itemImageCheck != null && itemImageCheck[0]) {
                    daoItems.deleteItemImage(request.body.ItemImageId, function (err, data) {
                        if (err) {
                            next(err);
                        } else {
                            response.json({
                                'status': 'ok',
                                'code': 1,
                                'message': data
                            });
                        }
                    });
                } else {
                    next(new Error(i18n.__('itemNotOwned')));
                }
            }
        });
    } else {
        next(new Error(i18n.__('noItemId')));
    }
});

module.exports = itemsApi;