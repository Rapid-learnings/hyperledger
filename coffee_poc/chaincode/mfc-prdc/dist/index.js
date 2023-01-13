// index.js
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.contracts = exports.pmcc = void 0;
// import { Shim } from 'fabric-shim'
const pmcc_1 = require("./pmcc");
var pmcc_2 = require("./pmcc");
Object.defineProperty(exports, "pmcc", { enumerable: true, get: function () { return pmcc_2.pmcc; } });
// const RemoveValues = require('./removevalues')
// const PmCc = require('./mfcPrd')
// export default pmcc;
exports.contracts = [pmcc_1.pmcc];
//# sourceMappingURL=index.js.map