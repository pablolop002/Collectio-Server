"use strict";

class DAOCategories {
    pool;

    constructor(pl) {
        this.pool = pl;
    }

    listCategories(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("SELECT Id as ServerId, Spanish, English, Catalan, Basque FROM Categories", function (err, data) {
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

    listSubcategories(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("SELECT Id as ServerId, Spanish, English, Catalan, Basque FROM Subcategories", function (err, data) {
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

    addCategory(category, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("INSERT INTO Categories(Spanish, English, Catalan, Basque) VALUES (?, ?, ?, ?)",
                    [category.Spanish, category.English, category.Catalan, category.Basque], function (err, data) {
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

    deleteCategory(categoryId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("DELETE FROM Categories WHERE Id = ?",
                    [categoryId], function (err, data) {
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