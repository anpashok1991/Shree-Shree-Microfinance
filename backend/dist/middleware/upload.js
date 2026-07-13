"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFields = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const uploadDir = path_1.default.join(__dirname, '..', '..', 'uploads');
const dirs = ['logo', 'documents', 'photos'];
for (const dir of dirs) {
    const p = path_1.default.join(uploadDir, dir);
    if (!fs_1.default.existsSync(p))
        fs_1.default.mkdirSync(p, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'documents';
        if (file.fieldname === 'photo')
            folder = 'photos';
        if (file.fieldname === 'logo')
            folder = 'logo';
        cb(null, path_1.default.join(uploadDir, folder));
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${(0, uuid_1.v4)()}${ext}`);
    },
});
const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const mimeOk = allowed.test(file.mimetype.split('/')[1]);
    const extOk = allowed.test(path_1.default.extname(file.originalname).toLowerCase().replace('.', ''));
    cb(null, extOk || mimeOk);
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
exports.uploadFields = exports.upload.fields([
    { name: 'aadhaar', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
]);
//# sourceMappingURL=upload.js.map