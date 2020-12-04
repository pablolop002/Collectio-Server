"use strict";

const mysql = require("mysql");

class DAOUsers {
    pool;

    constructor(pl) {
        this.pool = pl;
    }

    addOrUpdateApple(appleToken, mail, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM Users WHERE AppleId = ? OR Mail = ?",
                    [appleToken, mail], function (err, data) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (data.count > 0) {
                                connection.query("UPDATE Users SET AppleId = ? WHERE Id = ?",
                                    [appleToken, data.Id], function (err, dataInsert) {
                                        connection.release();
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        } else {
                                            callback(null, dataInsert);
                                        }
                                    });
                            } else {
                                connection.query("INSERT INTO Users(AppleId, Mail) VALUES (?, ?)",
                                    [appleToken, mail], function (err, dataInsert) {
                                        connection.release();
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        } else {
                                            callback(null, dataInsert);
                                        }
                                    });
                            }
                        }
                    });
            }
        });
    }

    addOrUpdateGoogle(googleToken, mail, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM Users WHERE GoogleId = ? OR Mail = ?",
                    [googleToken, mail], function (err, data) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (data.count > 0) {
                                connection.query("UPDATE Users SET GoogleId = ? WHERE Id = ?",
                                    [googleToken, data.Id], function (err, dataInsert) {
                                        connection.release();
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        } else {
                                            callback(null, dataInsert);
                                        }
                                    });
                            } else {
                                connection.query("INSERT INTO Users(GoogleId, Mail) VALUES (?, ?)",
                                    [googleToken, mail], function (err, dataInsert) {
                                        connection.release();
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        } else {
                                            callback(null, dataInsert);
                                        }
                                    });
                            }
                        }
                    });
            }
        });
    }

    updateUser(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("UPDATE Users SET Nickname = ?, Mail = ?, Image = ? WHERE (Id = ?)",
                    [user.Nickname, user.Mail, user.Image], function (err, data) {
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

    getUser(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM Users WHERE (Id = ?)",
                    [user], function (err, data) {
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

    existApikey(apikey, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM MobileSessions INNER JOIN Users on UserId = Id WHERE Token = ?",
                    [apikey], function (err, data) {
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

    /*rejectFriend(user, friend, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("DELETE FROM Friends WHERE (User1 = ? AND User2 = ?) OR (User1 = ? AND User2 = ?)",
                    [user, friend, friend, user], function (err, data) {
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

    requestFriend(user, friend, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("INSERT INTO Friends(User1, User2) VALUES (?, ?)",
                    [user, friend], function (err, data) {
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

    listFriends(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT id, fullName, img FROM Friends AS F LEFT JOIN Users AS U ON F.User1 = U.id " +
                    "WHERE Status = 'accepted' AND F.User2 = ?" +
                    " UNION " +
                    "SELECT id, fullName, img FROM Friends AS F LEFT JOIN Users AS U ON F.User2 = U.id " +
                    "WHERE Status = 'accepted' AND F.User1 = ?",
                    [user, user], function (err, data) {
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

    listFriendRequests(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT id, fullName, img FROM Friends LEFT JOIN Users ON User1 = id " +
                    "WHERE Status = 'pending' AND User2 = ?",
                    [user, user], function (err, data) {
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

module.exports = DAOUsers;