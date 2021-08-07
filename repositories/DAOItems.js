"use strict";

class DAOItems {
  pool;

  constructor(pl) {
    this.pool = pl;
  }

  getItem(item, userId, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "SELECT i.* FROM Items i Join Collections C on i.CollectionId = C.Id WHERE i.Id = ? AND C.UserId = ?",
          [item, userId],
          function (err, data) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null, data);
            }
          }
        );
      }
    });
  }

  getItemWithChildren(item, userId, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "SELECT i.*, ii.* FROM Items i Join Collections C on i.CollectionId = C.Id JOIN ItemImages ii on i.Id = ii.ItemId WHERE i.Id = ? AND C.UserId = ?",
          [item, userId],
          function (err, data) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null, data);
            }
          }
        );
      }
    });
  }

  getAllItemsFromCollection(collectionId, userId, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "SELECT i.* FROM Items i JOIN Collections c ON i.CollectionId = c.Id WHERE CollectionId = ? AND UserId = ?",
          [collectionId, userId],
          function (err, data) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null, data);
            }
          }
        );
      }
    });
  }

  getAllItemsFromCollectionWithChildren(collectionId, userId, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "SELECT i.*, ii.* FROM Items i JOIN Collections c on i.CollectionId = c.Id JOIN ItemImages ii ON i.Id = ii.ItemId WHERE i.CollectionId = ? AND c.UserId = ?",
          [collectionId],
          function (err, data) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null, data);
            }
          }
        );
      }
    });
  }

  addItem(item, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "INSERT INTO Items(CollectionId, Name, Description, SubcategoryId, Private, CreatedAt, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            item.CollectionId,
            item.Name,
            item.Description,
            item.SubcategoryId,
            item.Private === "false" ? 0 : 1,
            new Date(),
            new Date(),
          ],
          function (err, data) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null, data);
            }
          }
        );
      }
    });
  }

  updateItem(item, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        let query = "UPDATE Items SET UpdatedAt = ?";
        let values = [];
        values.push(new Date());

        if (item.Name) {
          query += ", Name = ?";
          values.push(item.Name);
        }

        if (item.Description) {
          query += ", Description = ?";
          values.push(item.Description);
        }

        if (item.SubcategoryId) {
          query += ", SubcategoryId = ?";
          values.push(item.SubcategoryId);
        }

        if (item.Private) {
          query += ", Private = ?";
          values.push(item.Private);
        }

        query += " WHERE Id = ?";
        values.push(item.Id);
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

  deleteItem(item, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "DELETE FROM Items WHERE Id = ?",
          [item],
          function (err, data) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null, data);
            }
          }
        );
      }
    });
  }

  addItemImage(itemImages, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "INSERT INTO ItemImages(ItemId, Image) VALUES (?, ?)",
          [itemImages.ItemId, itemImages.Image],
          function (err, data) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null, data);
            }
          }
        );
      }
    });
  }

  deleteItemImage(item, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "DELETE FROM ItemImages WHERE Id = ?",
          [item],
          function (err, data) {
            connection.release();
            if (err) {
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              callback(null, data);
            }
          }
        );
      }
    });
  }
}

module.exports = DAOItems;
