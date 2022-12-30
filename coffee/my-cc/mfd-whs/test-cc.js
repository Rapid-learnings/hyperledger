/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Contract } = require('fabric-contract-api')
const stateKey = 'state';

class testcc extends Contract {

    async init(ctx) {
        console.log('===== Initializing state in test contract =====');
        await ctx.stub.putState(stateKey, Buffer.from('hello'))
        console.log('===== State initialized to "hello" =====');
    }

    async get(ctx) {
        const stateBytes = await ctx.stub.getState(stateKey);
        const state = stateBytes.toString();
        return state;
    }
    
    async put(ctx, state) {
        await ctx.stub.putState(stateKey, Buffer.from(state.toString()));
        console.log('State has been changed to %s', state.toString());
    }
}

module.exports = testcc;