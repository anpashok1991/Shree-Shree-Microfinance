"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptController = void 0;
const ReceiptRepository_1 = require("../repositories/ReceiptRepository");
class ReceiptController {
    constructor() {
        this.receiptRepo = new ReceiptRepository_1.ReceiptRepository();
        this.getByCollection = async (req, res, next) => {
            try {
                const receipt = await this.receiptRepo.findFirst({ collectionId: req.params.collectionId });
                if (!receipt)
                    return res.status(404).json({ success: false, message: 'Receipt not found' });
                res.json({ success: true, data: receipt });
            }
            catch (error) {
                next(error);
            }
        };
        this.getByLoan = async (req, res, next) => {
            try {
                const receipts = await this.receiptRepo.findByLoan(req.params.loanId);
                res.json({ success: true, data: receipts });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ReceiptController = ReceiptController;
//# sourceMappingURL=ReceiptController.js.map