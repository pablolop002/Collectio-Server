"use strict";

class DAOCollections {
  pool;

  constructor(pl) {
    this.pool = pl;
  }

  getCollections(user, category, collection, syncDate, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        let query =
          "SELECT Id as ServerId, UserId as ServerUserId, Name, Description, Image, Private, CategoryId, CreatedAt, UpdatedAt FROM Collections WHERE true";
        let values = [];

        if (user) {
          query += " AND UserId = ?";
          values.push(user);
        } else {
          query += " AND Private = false";
        }

        if (category) {
          query += " AND CategoryId = ?";
          values.push(category);
        }

        if (collection) {
          query += " AND Id = ?";
          values.push(collection);
        }

        if (syncDate) {
          query += " AND UpdatedAt > ?";
          values.push(syncDate);
        }

        query += " ORDER BY UserId, ServerId";

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

  getCollectionsWithChildren(user, category, collection, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        let query =
          "SELECT c.Id as ServerCollectionId, c.CategoryId, c.UserId, c.Name as CollectionName," +
          " c.Description as CollectionDescription, c.Image as CollectionImage, c.Private as CollectionPrivate," +
          " c.CreatedAt as CollectionCreatedAt, c.UpdatedAt as CollectionUpdatedAt," +
          " i.Id as ServerItemId, i.SubcategoryId, i.Name as ItemName, i.Description as ItemDescription," +
          " i.CreatedAt as ItemCreatedAt, i.UpdatedAt as ItemUpdatedAt, i.Private as ItemPrivate," +
          " ii.Id as ServerItemImageId, ii.Image as ItemImage" +
          " FROM Collections c LEFT JOIN Items i ON i.CollectionId = c.Id LEFT JOIN ItemImages ii on i.Id = ii.ItemId WHERE true";
        let orderBy = " ORDER BY c.UserId, c.CategoryId, c.Id";
        let values = [];

        if (user) {
          query += " AND c.UserId = ?";
          values.push(user);
        } else {
          query += " AND c.Private = false AND i.Private = false";
        }

        if (category) {
          query += " AND c.CategoryId = ?";
          values.push(category);
        }

        if (collection) {
          query += " AND c.Id = ?";
          values.push(collection);
        }

        query += orderBy;

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

  insertCollection(collection, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(new Error("Error de conexión a la base de datos"));
      } else {
        connection.query(
          "INSERT INTO Collections(UserId, CategoryId, Name, Description, Image, Private, CreatedAt, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            collection.UserId,
            collection.CategoryId,
            collection.Name,
            collection.Description,
            collection.Image,
            collection.Private === "false" ? 0 : 1,
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

  updateCollection(collection, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(err);
      } else {
        let query = "UPDATE Collections SET UpdatedAt = ?";
        let values = [new Date()];

        if (collection.Name) {
          query += ", Name = ?";
          values.push(collection.Name);
        }

        if (collection.Description) {
          query += ", Description = ?";
          values.push(collection.Description);
        }

        if (collection.Image) {
          query += ", Image = ?";
          values.push(collection.Image);
        }

        if (collection.Private) {
          query += ", Private = ?";
          values.push(collection.Private);
        }

        query += " WHERE Id = ? AND UserId = ?";
        values.push(collection.ServerId, collection.UserId);

        connection.query(query, values, function (err, data) {
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

  deleteCollection(collection, userId, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) {
        callback(err);
      } else {
        connection.query(
          "DELETE FROM Collections WHERE Id = ? AND UserId = ?",
          [collection, userId],
          function (err, data) {
            connection.release();
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          }
        );
      }
    });
  }
}

module.exports = DAOCollections;
