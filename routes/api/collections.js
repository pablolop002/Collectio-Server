"use strict";

// Load modules
const express = require('express');
const fs = require('fs-extra');
const i18n = require('i18n');
const multer = require('multer');
const path = require('path');

// Config
const database = require('../../config/databases');
const collectionImages = multer({
    storage: multer.diskStorage({
        destination: (request, file, callback) => {
            let dest = path.join(__basedir, "storage", "images", "user" + request.user.Id, "temp");
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
                cb(new Error(i18n.__('fileFormatNotValid')), false);
            }
        }
    })
});

// Function includes
const DAOCollections = require('../../repositories/DAOCollections');

// Function instances
const daoCollections = new DAOCollections(database.pool);

// Router
const collectionsApi = express.Router();

collectionsApi.get('/', function (request, response, next) {
    let user = request.query.others && request.query.others === "true" ? null : request.user.Id;
    let category = request.query.categoryId ? request.query.categoryId : null;
    let collection = request.query.collectionId ? request.query.collectionId : null;
    let withChildren = request.query.withChildren ? request.query.withChildren : "false";
    let syncDate = request.query.lastSync ? request.query.lastSync : null;

    if (withChildren === "false") {
        daoCollections.getCollections(user, category, collection, syncDate, function (err, data) {
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
        daoCollections.getCollectionsWithChildren(user, category, collection, function (err, data) {
            if (err) {
                next(err);
            } else {
                data = data.reduce((accumulator, current) => {
                    let col = accumulator.findIndex(collection => collection.ServerId === current.ServerCollectionId);
                    if (col === -1 || col === accumulator.length) {
                        let collection = {
                            "ServerId": current.ServerCollectionId,
                            "CategoryId": current.CategoryId,
                            "UserId": current.UserId,
                            "Name": current.CategoryName,
                            "Description": current.CategoryDescription,
                            "Image": current.CategoryImage,
                            "Private": current.CategoryPrivate,
                            "CreatedAt": current.CategoryCreatedAt,
                            "UpdatedAt": current.CategoryUpdatedAt,
                            "Items": []
                        };

                        if (current.ServerItemId != null) {
                            collection.Items.push({
                                "ServerId": current.ServerItemId,
                                "CollectionId": current.ServerCollectionId,
                                "SubcategoryId": current.SubcategoryId,
                                "Name": current.ItemName,
                                "Description": current.ItemDescription,
                                "CreatedAt": current.ItemCreatedAt,
                                "UpdatedAt": current.ItemUpdatedAt,
                                "Private": current.ItemPrivate,
                                "Images": []
                            });

                            if (current.ServerItemImageId != null) {
                                collection.Items[0].Images.push({
                                    "ServerId": current.ServerItemImageId,
                                    "ItemId": current.ServerItemId,
                                    "Image": current.ItemImage
                                });
                            }
                        }

                        accumulator.push(collection);
                    } else {
                        let item = accumulator[col].Items.findIndex(item => item.ServerId === current.ServerItemId);
                        if (item === -1 || item === accumulator[col].Items.length) {
                            let item = {
                                "ServerId": current.ServerItemId,
                                "CollectionId": current.ServerCollectionId,
                                "SubcategoryId": current.SubcategoryId,
                                "Name": current.ItemName,
                                "Description": current.ItemDescription,
                                "CreatedAt": current.ItemCreatedAt,
                                "UpdatedAt": current.ItemUpdatedAt,
                                "Private": current.ItemPrivate,
                                "Images": []
                            }

                            if (current.ServerItemImageId != null) {
                                item.Images.push({
                                    "ServerId": current.ServerItemImageId,
                                    "ItemId": current.ServerItemId,
                                    "Image": current.ItemImage
                                });
                            }

                            accumulator[col].Items.push(item);
                        } else {
                            accumulator[col].Items[item].Images.push({
                                "ServerId": current.ServerItemImageId,
                                "ItemId": current.ServerItemId,
                                "Image": current.ItemImage
                            });
                        }
                    }

                    return accumulator;
                }, []);

                response.json({
                    'status': 'ok',
                    'code': 1,
                    'data': data
                });
            }
        });
    }
});

collectionsApi.put('/', collectionImages.single('Images'), function (request, response, next) {
    let collection = {
        'CategoryId': request.body.CategoryId,
        'UserId': request.user.Id,
        'Name': request.body.Name,
        'Desription': request.body.Description,
        'Image': request.file != null ? request.file.filename : null,
        'Private': request.body.Private,
    };

    daoCollections.insertCollection(collection, function (err, collectionId) {
        if (err) {
            next(err);
        } else {
            let finalPath = path.join(__basedir, "storage", "images", "user" + request.user.Id, "collection" + collectionId);
            fs.mkdirsSync(finalPath);
            fs.moveSync(request.file.path, path.join(finalPath, request.file.filename));
            response.json({
                'status': 'ok',
                'code': 1,
                'data': collectionId.insertId
            });
        }
    });
});

collectionsApi.post('/', collectionImages.single('Images'), function (request, response, next) {
    if (!request.body.ServerId) {
        response.json({
            'status': 'ko',
            'code': 2,
            'message': i18n.__('noCollectionId')
        });
    }

    daoCollections.getCollections(request.user.Id, null, request.body.ServerId, function (err, collection) {
        if (err) {
            next(err);
        } else {
            if (collection[0] != null) {
                if (request.body.Name) collection.Name = request.body.Name;
                if (request.body.Desription) collection.Desription = request.body.Desription;
                if (request.body.Private) collection.Private = request.body.Private;
                if (request.file) {
                    collection.Image = request.body.file.filename;
                    let finalPath = path.join(__basedir, "storage", "images", "user" + request.user.Id, "collection" + collection.Id);
                    fs.mkdirsSync(finalPath);
                    fs.moveSync(request.file.path, path.join(finalPath, request.file.filename));
                }

                daoCollections.updateCollection(collection, function (err, oldImage) {
                    if (err) {
                        next(err);
                    } else {
                        if (oldImage != null) {
                            fs.removeSync(path.join(__basedir, "storage", "images", "user" + request.user.Id, "collection" + collection.Id, oldImage));
                        }
                        response.json({
                            'status': 'ok',
                            'code': 1,
                            'data': collection.Id
                        });
                    }
                });
            }
        }
    });
});

collectionsApi.delete('/:id', collectionImages.none(), function (request, response, next) {
    if (request.params.id) {
        daoCollections.deleteCollection(request.body.ServerId, request.user.Id, function (err, data) {
            if (err) {
                next(err);
            } else {
                response.json({
                    'status': 'ok',
                    'code': 1,
                    'message': i18n.__('collectionDeleted')
                });
            }
        });
    } else {
        response.json({
            'status': 'ko',
            'code': 2,
            'message': i18n.__('noCollectionId')
        });
    }
});

module.exports = collectionsApi;