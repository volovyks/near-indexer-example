module.exports = {
  indexerDatabaseTestnet: {
    dialect: "postgres",
    host: "35.184.214.98",
    database: "testnet_explorer",
    username: "public_readonly",
    password: "nearprotocol",
  },
  indexerDatabaseMainnet: {
    dialect: "postgres",
    host: "104.199.89.51",
    database: "mainnet_explorer",
    username: "public_readonly",
    password: "nearprotocol",
  },
};