"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionController = void 0;
const CollectionService_1 = require("../services/CollectionService");
class CollectionController {
    constructor() {
        this.recordCollection = async (req, res, next) => {
            try {
                const collection = await this.collectionService.recordCollection({
                    ...req.body,
                    collectedById: req.user.userId,
                });
                res.status(201).json({
                    success: true,
                    message: 'Collection recorded successfully',
                    data: collection,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCollections = async (req, res, next) => {
            try {
                const { page, limit, loanId, staffId, startDate, endDate } = req.query;
                const result = await this.collectionService.getCollections(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined, loanId, req.user?.role === 'STAFF' ? req.user.userId : staffId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
                res.json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.getTodayStats = async (_req, res, next) => {
            try {
                const stats = await this.collectionService.getTodayStats();
                res.json({ success: true, data: stats });
            }
            catch (error) {
                next(error);
            }
        };
        this.collectionService = new CollectionService_1.CollectionService();
    }
}
exports.CollectionController = CollectionController;
//# sourceMappingURL=CollectionController.js.map