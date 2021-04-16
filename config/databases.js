"use strict";

const conf = require("./conf");
const session = require("express-session");
const mariaDBSession = require("express-mysql-session");
const mysql = require("mysql");

const MariaDBStore = mariaDBSession(session);

module.exports = {
  pool: mysql.createPool({
    host: conf.dbHost,
    //socketPath: conf.dbSocket,
    user: conf.dbUser,
    password: conf.dbPass,
    database: conf.dbName,
    dateStrings: true,
  }),
  sessionStore: new MariaDBStore({
    host: conf.dbHost,
    //socketPath: conf.dbSocket,
    user: conf.dbUser,
    password: conf.dbPass,
    database: conf.dbName,
    schema: {
      tableName: "WebSessions",
      columnNames: {
        session_id: "SessionId",
        expires: "Expires",
        data: "Data",
      },
    },
  }),
};
