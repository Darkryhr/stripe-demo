"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
const tslib_1 = require("tslib");
const firebaseAdmin = tslib_1.__importStar(require("firebase-admin"));
firebaseAdmin.initializeApp();
exports.db = firebaseAdmin.firestore();
exports.auth = firebaseAdmin.auth();
//# sourceMappingURL=firebase.js.map