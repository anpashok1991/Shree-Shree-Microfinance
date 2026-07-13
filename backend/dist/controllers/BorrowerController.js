"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowerController = void 0;
const BorrowerService_1 = require("../services/BorrowerService");
class BorrowerController {
    constructor() {
        this.getProfile = async (req, res, next) => {
            try {
                const profile = await this.borrowerService.getProfile(req.user.userId);
                res.json({ success: true, data: profile });
            }
            catch (error) {
                next(error);
            }
        };
        this.saveProfile = async (req, res, next) => {
            try {
                const profile = await this.borrowerService.createOrUpdateProfile(req.user.userId, req.body);
                res.json({ success: true, message: 'Profile saved', data: profile });
            }
            catch (error) {
                next(error);
            }
        };
        this.getLoanDetail = async (req, res, next) => {
            try {
                const loan = await this.borrowerService.getLoanDetail(req.user.userId, req.params.id);
                res.json({ success: true, data: loan });
            }
            catch (error) {
                next(error);
            }
        };
        this.borrowerService = new BorrowerService_1.BorrowerService();
    }
}
exports.BorrowerController = BorrowerController;
//# sourceMappingURL=BorrowerController.js.map