"use strict";

const Sequelize = require("sequelize");
const dbConfig = require(__dirname + "./../database");
const db = {};


const sequelizeIndexerBackendMainnetReadOnly = new Sequelize(
  dbConfig.indexerDatabaseMainnet.database,
  dbConfig.indexerDatabaseMainnet.username,
  dbConfig.indexerDatabaseMainnet.password,
  {
    host: dbConfig.indexerDatabaseMainnet.host,
    dialect: dbConfig.indexerDatabaseMainnet.dialect,
  }
);

const sequelizeIndexerBackendTestnetReadOnly = new Sequelize(
  dbConfig.indexerDatabaseTestnet.database,
  dbConfig.indexerDatabaseTestnet.username,
  dbConfig.indexerDatabaseTestnet.password,
  {
    host: dbConfig.indexerDatabaseTestnet.host,
    dialect: dbConfig.indexerDatabaseTestnet.dialect,
  }
);

db.sequelizeIndexerBackendMainnetReadOnly = sequelizeIndexerBackendMainnetReadOnly;
db.sequelizeIndexerBackendTestnetReadOnly = sequelizeIndexerBackendTestnetReadOnly;
db.Sequelize = Sequelize;

module.exports = db;