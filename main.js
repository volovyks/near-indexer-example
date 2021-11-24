const BN = require("bn.js");
const models = require("./models");
const {
    DS_INDEXER_MAINNET,
    DS_INDEXER_TESTNET,
} = require("./consts");

main();

async function main() {
    let paginationIndexer = {
        endTimestamp: Date.now(),
        transactionIndex: 0,
    };
    let result = await queryAccountTransactionsList('serhii.testnet', 3, paginationIndexer, DS_INDEXER_TESTNET);
    console.log(result);
}

async function queryAccountTransactionsList(
    accountId,
    limit = 15,
    paginationIndexer,
    dataSource,
  ) {
    return await query(
      [
        `SELECT transactions.transaction_hash AS hash,
                transactions.signer_account_id AS signer_id,
                transactions.receiver_account_id AS receiver_id,
                transactions.included_in_block_hash AS block_hash,
                DIV(transactions.block_timestamp, 1000 * 1000) AS block_timestamp,
                transactions.index_in_chunk AS transaction_index
        FROM transactions
        ${
          paginationIndexer
            ? `WHERE (transaction_hash IN
                (SELECT originated_from_transaction_hash
                FROM receipts
                WHERE receipts.predecessor_account_id = :account_id
                  OR receipts.receiver_account_id = :account_id))
        AND (transactions.block_timestamp < :end_timestamp
              OR (transactions.block_timestamp = :end_timestamp
                  AND transactions.index_in_chunk < :transaction_index))`
            : `WHERE transaction_hash IN
              (SELECT originated_from_transaction_hash
              FROM receipts
              WHERE receipts.predecessor_account_id = :account_id
                OR receipts.receiver_account_id = :account_id)`
        }
        ORDER BY transactions.block_timestamp DESC,
                transactions.index_in_chunk DESC
        LIMIT :limit`,
        {
          account_id: accountId,
          end_timestamp: paginationIndexer
            ? new BN(paginationIndexer.endTimestamp).muln(10 ** 6).toString()
            : undefined,
          transaction_index: paginationIndexer?.transactionIndex,
          limit,
        },
      ],
      { dataSource }
    );
  };

async function query([query, replacements], { dataSource }) {
    const sequelize = getSequelize(dataSource);
    return await sequelize.query(query, {
        replacements,
        type: models.Sequelize.QueryTypes.SELECT,
    });
};

function getSequelize(dataSource) {
    switch (dataSource) {
        case DS_INDEXER_MAINNET:
            return models.sequelizeIndexerBackendMainnetReadOnly;
        case DS_INDEXER_TESTNET:
            return models.sequelizeIndexerBackendTestnetReadOnly;
        default:
            throw Error("getSequelize() has no default dataSource");
    }
}
