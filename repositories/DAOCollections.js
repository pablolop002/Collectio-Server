"use strict";

class DAOCollections {
    pool;

    constructor(pl) {
        this.pool = pl;
    }

    getCollections(user, category, collection, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let query = "SELECT Id as ServerId, UserId, Name, Description, Image, Private, CategoryId, CreatedAt, UpdatedAt FROM Collections WHERE true";
                let orderBy = " ORDER BY UserId, ServerId";
                let values = [];

                if (user) {
                    query += " AND UserId = ?";
                    values.push(user);
                } else {
                    query += " AND Private = false";
                }

                if (category) {
                    query += " AND CategoryId = ?";
                    values.push(category);
                }

                if (collection) {
                    query += " AND Id = ?";
                    values.push(collection);
                }

                query += orderBy;

                connection.query(query, values, function (err, data) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        callback(null, data);
                    }
                });
            }
        });
    }

    getCollectionsWithChildren(user, category, collection, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let query = "SELECT c.Id as ServerCollectionId, c.CategoryId, c.UserId, c.Name as CategoryName," +
                    " c.Description as CategoryDescription, c.Image as CategoryImage, c.Private as CategoryPrivate," +
                    " c.CreatedAt as CategoryCreatedAt, c.UpdatedAt as CategoryUpdatedAt," +
                    " i.Id as ServerItemId, i.SubcategoryId, i.Name as ItemName, i.Description as ItemDescription," +
                    " i.CreatedAt as ItemCreatedAt, i.UpdatedAt as ItemUpdatedAt, i.Private as ItemPrivate," +
                    " ii.Id as ServerItemImageId, ii.Image as ItemImage" +
                    " FROM Collections c LEFT JOIN Items i ON i.CollectionId = c.Id LEFT JOIN ItemImages ii on i.Id = ii.ItemId WHERE true";
                let orderBy = " ORDER BY c.UserId, c.CategoryId, c.Id";
                let values = [];

                if (user) {
                    query += " AND c.UserId = ?";
                    values.push(user);
                } else {
                    query += " AND c.Private = false AND i.Private = false";
                }

                if (category) {
                    query += " AND c.CategoryId = ?";
                    values.push(category);
                }

                if (collection) {
                    query += " AND c.Id = ?";
                    values.push(collection);
                }

                query += orderBy;

                connection.query(query, values, function (err, data) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        callback(null, data);
                    }
                });
            }
        });
    }

    insertCollection(collection, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("INSERT INTO Collections(UserId, CategoryId, Name, Description, Image, Private, CreatedAt, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [collection.UserId, collection.CategoryId, collection.Name, collection.Description, collection.Image, collection.Private, new Date(), new Date()],
                    function (err, data) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            callback(null, data);
                        }
                    });
            }
        });
    }

    updateCollection(collection, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("SELECT * FROM Collections WHERE Id = ? AND UserId = ?", [collection.Id, collection.UserId], function (err, oldCollection) {
                    if (err) {
                        callback(err);
                    } else {
                        let query = "UPDATE Collections SET UpdatedAt = ?";
                        let values = [];
                        values.push(new Date());

                        if (collection.Name) {
                            query += ", Name = ?";
                            values.push(collection.Name);
                        }

                        if (collection.Description) {
                            query += ", Description = ?";
                            values.push(collection.Description);
                        }

                        if (collection.Image) {
                            query += ", Image = ?";
                            values.push(collection.Image);
                        }

                        if (collection.Private) {
                            query += ", Private = ?";
                            values.push(collection.Private);
                        }

                        query += " WHERE Id = ? AND UserId = ?";
                        values.push([collection.Id, collection.UserId]);

                        connection.query(query, values, function (err, data) {
                            connection.release();
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, oldCollection[0].Image);
                            }
                        });
                    }
                });
            }
        });
    }

    deleteCollection(collection, userId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("DELETE FROM Collections WHERE Id = ? AND UserId = ?",
                    [collection, userId],
                    function (err, data) {
                        connection.release();
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, data);
                        }
                    });
            }
        });
    }
}

module.exports = DAOCollections;