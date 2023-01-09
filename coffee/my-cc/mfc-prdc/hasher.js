/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { createHash } = require('crypto');
const protobuf = require("protobufjs");

async function main() {
    try {
        // let s = ["get"]
        const hash = {"status":200,"payload":"aGVsbG8="}
        const buf = protobuf.encoder(hash)
        // console.log(buf);
        let b = protobuf.decoder(buf);
        console.log(b);
    } catch(err) {
        console.error(`Failed to evaluate transaction: ${err}`);
        process.exit(1);
    }
}
main();

// class hasher {
//     async getHash(string) {
//         const hash = await createHash('sha256').update('1').digest('hex');
//         return hash;
//     }
// }
// module.exports = hasher;