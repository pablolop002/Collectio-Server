"use strict";

const uuid = require('uuid');

class DAOUsers {
    pool;

    constructor(pl) {
        this.pool = pl;
    }

    addOrUpdateApple(appleToken, mail, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("SELECT * FROM Users WHERE AppleId = ? OR Mail = ?",
                    [appleToken, mail], function (err, tempUser) {
                        if (err) {
                            connection.release();
                            callback(err);
                        } else {
                            if (tempUser.length > 0) {
                                connection.query("UPDATE Users SET AppleId = ? WHERE Id = ?",
                                    [appleToken, tempUser[0].Id], function (err, dataInsert) {
                                        if (err) {
                                            connection.release();
                                            callback(err);
                                        } else {
                                            connection.query("SELECT * FROM Users WHERE Id = ?",
                                                [tempUser[0].Id], function (err, user) {
                                                    connection.release();
                                                    if (err) {
                                                        callback(err);
                                                    } else {
                                                        callback(null, user[0]);
                                                    }
                                                });
                                        }
                                    });
                            } else {
                                connection.query("INSERT INTO Users(AppleId, Mail) VALUES (?, ?)",
                                    [appleToken, mail], function (err, dataInsert) {
                                        if (err) {
                                            connection.release();
                                            callback(err);
                                        } else {
                                            connection.query("SELECT * FROM Users WHERE Id = ?",
                                                [dataInsert.insertId], function (err, user) {
                                                    connection.release();
                                                    if (err) {
                                                        callback(err);
                                                    } else {
                                                        callback(null, user[0]);
                                                    }
                                                });
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
                callback(err);
            } else {
                connection.query("SELECT * FROM Users WHERE GoogleId = ? OR Mail = ?",
                    [googleToken, mail], function (err, tempUser) {
                        if (err) {
                            connection.release();
                            callback(err);
                        } else {
                            if (tempUser.length > 0) {
                                connection.query("UPDATE Users SET GoogleId = ? WHERE Id = ?",
                                    [googleToken, tempUser[0].Id], function (err, dataInsert) {
                                        if (err) {
                                            connection.release();
                                            callback(err);
                                        } else {
                                            connection.query("SELECT * FROM Users WHERE Id = ?",
                                                [tempUser[0].Id], function (err, user) {
                                                    connection.release();
                                                    if (err) {
                                                        callback(err);
                                                    } else {
                                                        callback(null, user[0]);
                                                    }
                                                });
                                        }
                                    });
                            } else {
                                connection.query("INSERT INTO Users(GoogleId, Mail) VALUES (?, ?)",
                                    [googleToken, mail], function (err, dataInsert) {
                                        if (err) {
                                            connection.release();
                                            callback(err);
                                        } else {
                                            connection.query("SELECT * FROM Users WHERE Id = ?",
                                                [dataInsert.insertId], function (err, user) {
                                                    connection.release();
                                                    if (err) {
                                                        callback(err);
                                                    } else {
                                                        callback(null, user[0]);
                                                    }
                                                });
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
                callback(err);
            } else {
                connection.query("UPDATE Users SET Nickname = ?, Mail = ?, Image = ? WHERE (Id = ?)",
                    [user.Nickname, user.Mail, user.Image], function (err, data) {
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

    getUser(user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("SELECT * FROM Users WHERE (Id = ?)",
                    [user], function (err, data) {
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

    createApikey(userId, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                let token = uuid.v4();
                connection.query("INSERT INTO MobileSessions(Token, UserId) VALUES (?, ?)",
                    [token, userId], function (err, data) {
                        connection.release();
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, token);
                        }
                    });
            }
        });
    }

    existApikey(apikey, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("SELECT * FROM MobileSessions INNER JOIN Users on UserId = Id WHERE Token = ?",
                    [apikey], function (err, data) {
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

module.exports = DAOUsers;