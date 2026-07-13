"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryController = void 0;
const EnquiryService_1 = require("../services/EnquiryService");
class EnquiryController {
    constructor() {
        this.service = new EnquiryService_1.EnquiryService();
        this.create = async (req, res, next) => {
            try {
                const enquiry = await this.service.create(req.body);
                res.status(201).json({ success: true, message: 'Enquiry submitted', data: enquiry });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAll = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const result = await this.service.getAll(page, limit);
                res.json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.markRead = async (req, res, next) => {
            try {
                await this.service.markRead(req.params.id);
                res.json({ success: true, message: 'Marked as read' });
            }
            catch (error) {
                next(error);
            }
        };
        this.respond = async (req, res, next) => {
            try {
                await this.service.respond(req.params.id, req.body.response);
                res.json({ success: true, message: 'Response sent' });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.EnquiryController = EnquiryController;
//# sourceMappingURL=EnquiryController.js.map