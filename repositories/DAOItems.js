"use strict";

const mysql = require("mysql");

class DAOItems {
    pool;

    constructor(pl) {
        this.pool = pl;
    }

    getItem(item, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM Items WHERE Id = ?",
                    [item], function (err, data) {
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

    getAllItemsFromCollection(collection, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM Items WHERE CollectionId = ?",
                    [collection], function (err, data) {
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

    addItem(item, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("INSERT INTO Items(CollectionId, Name, Description, SubcategoryId) VALUES (?, ?, ?, ?)",
                    [item.CollectionId, item.Name, item.Description, item.SubcategoryId], function (err, data) {
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

module.exports = DAOItems;