"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaController = void 0;
const AreaService_1 = require("../services/AreaService");
class AreaController {
    constructor() {
        this.createArea = async (req, res, next) => {
            try {
                const area = await this.areaService.createArea(req.body.name, req.body.code);
                res.status(201).json({ success: true, message: 'Area created successfully', data: area });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAreas = async (_req, res, next) => {
            try {
                const areas = await this.areaService.getAreas();
                res.json({ success: true, data: areas });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAreaById = async (req, res, next) => {
            try {
                const area = await this.areaService.getAreaById(req.params.id);
                res.json({ success: true, data: area });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateArea = async (req, res, next) => {
            try {
                const area = await this.areaService.updateArea(req.params.id, req.body.name, req.body.code);
                res.json({ success: true, message: 'Area updated successfully', data: area });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteArea = async (req, res, next) => {
            try {
                await this.areaService.deleteArea(req.params.id, req.user.userId);
                res.json({ success: true, message: 'Area deleted successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.areaService = new AreaService_1.AreaService();
    }
}
exports.AreaController = AreaController;
//# sourceMappingURL=AreaController.js.map