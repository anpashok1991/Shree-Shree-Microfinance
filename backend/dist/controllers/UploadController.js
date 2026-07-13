"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const SettingsRepository_1 = require("../repositories/SettingsRepository");
const CustomerRepository_1 = require("../repositories/CustomerRepository");
const fs_1 = __importDefault(require("fs"));
class UploadController {
    constructor() {
        this.settingsRepo = new SettingsRepository_1.SettingsRepository();
        this.customerRepo = new CustomerRepository_1.CustomerRepository();
        this.uploadLogo = async (req, res, next) => {
            try {
                if (!req.file)
                    return res.status(400).json({ success: false, message: 'No file uploaded' });
                const fileBuffer = fs_1.default.readFileSync(req.file.path);
                const base64 = fileBuffer.toString('base64');
                const dataUrl = `data:${req.file.mimetype};base64,${base64}`;
                await this.settingsRepo.upsertValue('company_logo', dataUrl);
                fs_1.default.unlinkSync(req.file.path);
                res.json({ success: true, message: 'Logo uploaded', data: { url: dataUrl } });
            }
            catch (error) {
                next(error);
            }
        };
        this.uploadCustomerDocs = async (req, res, next) => {
            try {
                const customerId = req.params.customerId;
                const customer = await this.customerRepo.findById(customerId);
                if (!customer)
                    return res.status(404).json({ success: false, message: 'Customer not found' });
                const files = req.files;
                const updateData = {};
                if (files?.aadhaar?.[0])
                    updateData.aadhaarCopy = `/uploads/documents/${files.aadhaar[0].filename}`;
                if (files?.pan?.[0])
                    updateData.panCopy = `/uploads/documents/${files.pan[0].filename}`;
                if (files?.photo?.[0])
                    updateData.photoUpload = `/uploads/photos/${files.photo[0].filename}`;
                await this.customerRepo.update(customerId, updateData);
                const updated = await this.customerRepo.findById(customerId);
                res.json({ success: true, message: 'Documents uploaded', data: updated });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.UploadController = UploadController;
//# sourceMappingURL=UploadController.js.map