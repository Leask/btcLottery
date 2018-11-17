'use strict';

// https://blockexplorer.com/api-ref
// https://github.com/planetcoder/readerLottery

const request = require('request-promise');
const sha1    = require('sha1');

const btcEndPoint = 'https://blockexplorer.com/api/';

const getChainStatus = async () => {
    const resp = await request({
        method : 'GET',
        uri    : `${btcEndPoint}status`,
        json   : true,
    }).promise();
    models.utility.assert(
        resp && resp.info, 'Error getting BTC chain status.', 500
    );
    return resp.info;
};

const getBlockHashByIndex = async (blockIndex) => {
    models.utility.assert(blockIndex, 'Invalid block index.', 500);
    const resp = await request({
        method : 'GET',
        uri    : `${btcEndPoint}block-index/${blockIndex}`,
        json   : true,
    }).promise();
    models.utility.assert(
        resp && resp.blockHash, 'Error getting BTC block hash.', 500
    );
    return resp.blockHash;
};

const getBlockByHash = async (blockHash) => {
    models.utility.assert(blockHash, 'Invalid block hash.', 500);
    const resp = await request({
        method : 'GET',
        uri    : `${btcEndPoint}block/${blockHash}`,
        json   : true,
    }).promise();
    models.utility.assert(resp, 'Error getting BTC block.', 500);
    return resp;
};

const getLastBlock = async () => {
    const inf = await getChainStatus();
    const hsh = await getBlockHashByIndex(inf.blocks);
    const blk = await getBlockByHash(hsh);
    return blk;
};

const pick = async (total) => {
    models.utility.assert(total, 'Invalid total number.', 500);
    const blk = await getLastBlock();
    models.utility.assert(
        blk && blk.tx && blk.tx[0], 'Invalid block hash.', 500
    );
    return parseInt(sha1(blk.tx[0]).substr(0, 10), 16) % total;
};

(async () => {
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await timeout(3000);
    console.log(await pick(100));
})();
