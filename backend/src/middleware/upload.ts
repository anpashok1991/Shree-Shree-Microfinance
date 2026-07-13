import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
const dirs = ['logo', 'documents', 'photos'];

for (const dir of dirs) {
  const p = path.join(uploadDir, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'documents';
    if (file.fieldname === 'photo') folder = 'photos';
    if (file.fieldname === 'logo') folder = 'logo';
    cb(null, path.join(uploadDir, folder));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const mimeOk = allowed.test(file.mimetype.split('/')[1]);
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
  cb(null, extOk || mimeOk);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadFields = upload.fields([
  { name: 'aadhaar', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
]);
