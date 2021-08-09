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
        let query =
          "SELECT i.*, c.UserId as ServerUserId FROM Items i Join Collections c on i.CollectionId = c.Id WHERE i.Id = ?";
        let values = [item];

        if (userId) {
          query += " AND c.UserId = ?";
          values.push(userId);
        }

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

  getItemWithChildren(item, userId, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        let query =
          "SELECT c.UserId as UserServerId, i.Id as ServerItemId, i.SubcategoryId, i.CollectionId as ServerCollectionId," +
          " i.Name as ItemName, i.Description as ItemDescription, i.CreatedAt as ItemCreatedAt," +
          " i.UpdatedAt as ItemUpdatedAt, i.Private as ItemPrivate, ii.Id as ServerItemImageId, ii.Image as ItemImage" +
          " FROM Items i Join Collections c on i.CollectionId = c.Id JOIN ItemImages ii on i.Id = ii.ItemId WHERE i.Id = ?";
        let values = [item];

        if (userId) {
          query += "AND c.UserId = ?";
          values.push(userId);
        }

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

  getAllItemsFromCollection(collectionId, userId, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        let query =
          "SELECT c.UserId as UserServerId, c.Id as ServerCollectionId, i.Id as ServerItemId," +
          " i.SubcategoryId as SubcategoryId, i.Name as ItemName, i.Description as ItemDescription," +
          " i.CreatedAt as ItemCreatedAt, i.UpdatedAt as ItemUpdatedAt, i.Private as ItemPrivate FROM" +
          " Items i JOIN Collections c ON i.CollectionId = c.Id WHERE CollectionId = ?";
        let values = [collectionId];

        if (userId) {
          query += " AND c.UserId = ?";
          values.push(userId);
        }

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

  getAllItemsFromCollectionWithChildren(collectionId, userId, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        let query =
          "SELECT c.UserId as UserServerId, i.Id as ServerItemId, i.SubcategoryId, i.CollectionId as ServerCollectionId, i.Name as ItemName, i.Description as ItemDescription, i.CreatedAt as ItemCreatedAt, i.UpdatedAt as ItemUpdatedAt, i.Private as ItemPrivate, ii.Id as ServerItemImageId, ii.Image as ItemImage FROM Items i Join Collections c on i.CollectionId = c.Id JOIN ItemImages ii on i.Id = ii.ItemId WHERE i.CollectionId = ?";
        let values = [collectionId];

        if (userId) {
          query += " AND c.UserId = ?";
          values.push(userId);
        }
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

  addItem(item, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "INSERT INTO Items(CollectionId, Name, Description, SubcategoryId, Private, CreatedAt, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            item.CollectionServerId,
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

  getItemImage(itemImage, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "SELECT * FROM ItemImages WHERE Id = ?",
          [itemImage],
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

  getItemImagesFromItem(item, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "SELECT Id as ServerId, ItemId as ItemServerId, Image FROM ItemImages WHERE ItemId = ?",
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
        let query = "INSERT INTO ItemImages(ItemId, Image) VALUES (?, ?)";
        let values = [];

        itemImages.forEach((elem, index, array) => {
          if (index !== 0) {
            query += ", (?, ?)";
          }

          values.push(elem.ItemId, elem.Image);
        });

        connection.query(query, values, function (err, data, fields) {
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

  deleteItemImages(items, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "DELETE FROM ItemImages WHERE Id IN (?)",
          [items],
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
