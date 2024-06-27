"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: 'dpwpmkfaa',
    api_key: '389266549695939',
    api_secret: 'BoQ-fzKMJyOdr_GXcrYPh6kjN0I',
    secure: true
});
exports.default = cloudinary_1.v2;
