"use strict";

const mysql = require("mysql");

class DAOCategories {
    pool;

    constructor(pl) {
        this.pool = pl;
    }

    listCategories(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT Id as ServerId, Spanish, English, Catalan, Basque FROM Categories", function (err, data) {
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

    addGroup(group, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("INSERT INTO Categories(Spanish, English, Catalan, Basque) VALUES (?, ?, ?, ?)",
                    ["", "", "", ""], function (err, data) {
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

    deleteGroup(groupId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("DELETE FROM Categories WHERE Id = ?",
                    [groupId], function (err, data) {
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

    /*updateGroup(group, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("INSERT Categories(spanish, english, catalan, basque) VALUES (?,?,?,?)",
                    ["","","",""],
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
    }*/
}

module.exports = DAOCategories;