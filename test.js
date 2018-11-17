'use strict';

const lottery = require('./index');

(async () => {
    console.log(await lottery.pick(100));
})();
