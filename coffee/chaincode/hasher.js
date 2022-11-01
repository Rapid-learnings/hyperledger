/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { createHash } = require('crypto');

class hasher {
    async getHash(string) {
        return await createHash('sha256').update('1').digest('hex');
    }
}
module.exports = hasher;