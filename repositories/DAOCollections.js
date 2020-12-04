"use strict";

const mysql = require("mysql");

class DAOCollections {
    pool;

    constructor(pl) {
        this.pool = pl;
    }

    getAllCollectionsByCategory(user, Category, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT Id as ServerId, Name, Description, Image, Private FROM Collections WHERE UserId = ? AND CategoryId = ?",
                    [user, Category],
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

    getAllCollections(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT Id as ServerId, Name, Description, Image, Private, CategoryId FROM Collections WHERE UserId = ? ORDER BY CategoryId",
                    [user],
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

    getCollection(collection, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT Id as ServerId, Name, Description, Image, Private, CategoryId FROM Collections WHERE Id = ?",
                    [collection],
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

    insertCollection(collection, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("INSERT INTO Collections(UserId, CategoryId, Name, Description, Image, Private) VALUES (?, ?, ?, ?, ?, ?)",
                    [collection.UserId, collection.CategoryId, collection.Name, collection.Description, collection.Image, collection.Private],
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
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("UPDATE Collections SET Name = ?, Description = ?, Image = ?, Private = ? WHERE Id = ?",
                    [collection.Name, collection.Description, collection.Image, collection.Private, collection.ServerId],
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

    deleteCollection(collection, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("DELETE FROM Collections WHERE Id = ?",
                    [collection.Name, collection.Description, collection.Image, collection.Private, collection.ServerId],
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
}