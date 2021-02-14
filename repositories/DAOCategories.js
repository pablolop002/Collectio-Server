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
                connection.query("SELECT Id, Spanish, English, Catalan, Basque FROM Categories", function (err, data) {
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
                connection.query("SELECT Id, CategoryId, Spanish, English, Catalan, Basque FROM Subcategories", function (err, data) {
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

    updateCategory(category, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("UPDATE Categories SET Spanish = ?, English = ?, Catalan = ?, Basque = ? WHERE Id = ?",
                    [category.Spanish, category.English, category.Catalan, category.Basque, category.Id],
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

    addSubcategory(subcategory, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("INSERT INTO Subcategories(CategoryId, Spanish, English, Catalan, Basque) VALUES (?, ?, ?, ?, ?)",
                    [subcategory.CategoryId, subcategory.Spanish, subcategory.English, subcategory.Catalan, subcategory.Basque], function (err, data) {
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

    deleteSubcategory(subcategoryId, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("DELETE FROM Subcategories WHERE Id = ?",
                    [subcategoryId], function (err, data) {
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

    updateSubcategory(subcategory, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("UPDATE Subcategories SET Spanish = ?, English = ?, Catalan = ?, Basque = ? WHERE Id = ?",
                    [subcategory.Spanish, subcategory.English, subcategory.Catalan, subcategory.Basque, subcategory.Id],
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

module.exports = DAOCategories;