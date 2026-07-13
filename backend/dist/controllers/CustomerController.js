"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const CustomerService_1 = require("../services/CustomerService");
class CustomerController {
    constructor() {
        this.createCustomer = async (req, res, next) => {
            try {
                const customer = await this.customerService.createCustomer({
                    ...req.body,
                    createdById: req.user.userId,
                });
                res.status(201).json({ success: true, message: 'Customer created successfully', data: customer });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomers = async (req, res, next) => {
            try {
                const { page, limit, areaId, staffId } = req.query;
                const result = await this.customerService.getCustomers(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined, areaId, (req.user?.role === 'STAFF' ? req.user.userId : staffId));
                res.json({ success: true, ...result });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerById = async (req, res, next) => {
            try {
                const customer = await this.customerService.getCustomerById(req.params.id);
                res.json({ success: true, data: customer });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateCustomer = async (req, res, next) => {
            try {
                const customer = await this.customerService.updateCustomer(req.params.id, req.body, req.user.userId);
                res.json({ success: true, message: 'Customer updated successfully', data: customer });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteCustomer = async (req, res, next) => {
            try {
                await this.customerService.deleteCustomer(req.params.id, req.user.userId);
                res.json({ success: true, message: 'Customer deleted successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.searchCustomers = async (req, res, next) => {
            try {
                const { q } = req.query;
                const customers = await this.customerService.searchCustomers(q);
                res.json({ success: true, data: customers });
            }
            catch (error) {
                next(error);
            }
        };
        this.customerService = new CustomerService_1.CustomerService();
    }
}
exports.CustomerController = CustomerController;
//# sourceMappingURL=CustomerController.js.map