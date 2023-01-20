// index.js
'use strict';

// import { Shim } from 'fabric-shim'
import { pmcc } from './pmcc'
export { pmcc } from './pmcc'
// const RemoveValues = require('./removevalues')
// const PmCc = require('./mfcPrd')



// export default pmcc;
export const contracts: any[] = [ pmcc ];
// Shim.start(new SimpleChaincode());
