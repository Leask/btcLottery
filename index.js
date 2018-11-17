'use strict';

// https://blockexplorer.com/api-ref
// https://github.com/planetcoder/readerLottery

const request = require('request-promise');
const sha1    = require('sha1');

const btcEndPoint = 'https://blockexplorer.com/api/';

const assert = (flag, message) => {
    if (flag) {
        return;
    }
    throw new Error(message);
};

const getChainStatus = async () => {
    const resp = await request({
        method : 'GET',
        uri    : `${btcEndPoint}status`,
        json   : true,
    }).promise();
    assert(resp && resp.info, 'Error getting BTC chain status.');
    return resp.info;
};

const getBlockHashByIndex = async (blockIndex) => {
    assert(blockIndex, 'Invalid block index.');
    const resp = await request({
        method : 'GET',
        uri    : `${btcEndPoint}block-index/${blockIndex}`,
        json   : true,
    }).promise();
    assert(resp && resp.blockHash, 'Error getting BTC block hash.');
    return resp.blockHash;
};

const getBlockByHash = async (blockHash) => {
    assert(blockHash, 'Invalid block hash.');
    const resp = await request({
        method : 'GET',
        uri    : `${btcEndPoint}block/${blockHash}`,
        json   : true,
    }).promise();
    assert(resp, 'Error getting BTC block.');
    return resp;
};

const getLastBlock = async () => {
    const inf = await getChainStatus();
    const hsh = await getBlockHashByIndex(inf.blocks);
    const blk = await getBlockByHash(hsh);
    return blk;
};

const pick = async (total) => {
    assert(total, 'Invalid total number.');
    const blk = await getLastBlock();
    assert(blk && blk.tx && blk.tx[0], 'Invalid block hash.');
    return parseInt(sha1(blk.tx[0]).substr(0, 10), 16) % total;
};

module.exports = {
    pick,
};
