"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const SearchService_1 = require("../services/SearchService");
class SearchController {
    constructor() {
        this.globalSearch = async (req, res, next) => {
            try {
                const { q } = req.query;
                const results = await this.searchService.search(q, req.user);
                res.json({ success: true, data: results });
            }
            catch (error) {
                next(error);
            }
        };
        this.searchService = new SearchService_1.SearchService();
    }
}
exports.SearchController = SearchController;
//# sourceMappingURL=SearchController.js.map