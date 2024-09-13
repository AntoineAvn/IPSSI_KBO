"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = __importStar(require("cheerio"));
const promises_1 = __importDefault(require("fs/promises"));
const BASE_URL = "https://www.companyweb.be/search?query=";
class GetInfo {
    static request_website(url, number_establishment) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`${url}${number_establishment ? number_establishment : ""} \n`);
            try {
                const req = yield fetch(`${url}${number_establishment ? number_establishment : ""}`, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                    }
                });
                return yield req.text();
            }
            catch (error) {
                console.error(GetInfo.getMessageError(error));
                return GetInfo.getMessageError(error);
            }
        });
    }
    static loop_every_establishment(number_establishment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const get_list_establishment = yield GetInfo.request_website(BASE_URL, number_establishment);
                const $ = cheerio.load(get_list_establishment);
                const list_establishment_tr = $(".tr-anchor");
                let test = [];
                list_establishment_tr.each((index, element) => {
                    const link = $(element).attr("href") || '';
                    (() => __awaiter(this, void 0, void 0, function* () {
                        const data = yield GetInfo.request_website("https://www.companyweb.be" + link);
                        const info_gen = yield GetInfo.get_generic_info(data);
                        yield GetInfo.writeToJSON(info_gen, index);
                    }))();
                });
                console.log(test);
            }
            catch (error) {
                console.error(GetInfo.getMessageError(error));
            }
        });
    }
    static get_generic_info(html) {
        return __awaiter(this, void 0, void 0, function* () {
            if (html === "")
                return null;
            const $ = cheerio.load(html);
            const genericInfo = {
                VAT: "",
                Full_name: "",
                Address: "",
                Established: "",
                Principal_activity: "",
                Type: ""
            };
            const Company_name = $("#company-name").text();
            genericInfo.Full_name = Company_name;
            $(".row .mt-3").first().children().first().children().each((_, e) => {
                const elements = $(e).find("[itemprop]");
                if (elements.length === 0)
                    return;
                const elementText = elements.text();
                const regex_VAT_enterprise = /[A-Z]{2} [0-9]{4}\.[0-9]{3}\.[0-9]{3}/;
                const regex_VAT_establishment = /2\.[A-Z]{2} [0-9]{3}\.[0-9]{3}\.[0-9]{3}/;
                const regex_VAT_branch = /9\.[A-Z]{2} [0-9]{3}\.[0-9]{3}\.[0-9]{3}/;
                const date_test = /(0[1-9]|[12][0-9]|3[01])(\/|-)(0[1-9]|1[1,2])(\/|-)(19|20)\d{2}/;
                if (regex_VAT_branch.test(elementText)) {
                    genericInfo.VAT = elementText;
                    genericInfo.Type = "Branch";
                    return;
                }
                if (regex_VAT_establishment.test(elementText)) {
                    genericInfo.VAT = elementText;
                    genericInfo.Type = "Establishment";
                    return;
                }
                if (regex_VAT_enterprise.test(elementText)) {
                    genericInfo.VAT = elementText;
                    genericInfo.Type = "Enterprise";
                    return;
                }
                if (date_test.test(elementText)) {
                    const date_get = new Date(elementText);
                    genericInfo.Established = GetInfo.formatDate(date_get);
                    return;
                }
                if (elements.is("h2")) {
                    genericInfo.Full_name = elementText;
                    return;
                }
                if (elements.children().length > 1) {
                    genericInfo.Address = elements.children()
                        .map((_, child) => $(child).text().trim())
                        .get()
                        .filter(Boolean)
                        .join(', ');
                    return;
                }
            });
            return genericInfo;
        });
    }
    static financial_situation(html) {
        if (html === "")
            return null;
        const $ = cheerio.load(html);
        const financial_situation = $(".may-overflow-x");
        if (financial_situation.length === 0)
            return null;
        const elements = $(".may-overflow-x .start-tab").map((_, e) => $(e).text()).get();
        const years = $(".may-overflow-x th").map((_, e) => $(e).text()).get();
        const data = $(".may-overflow-x .financial-number").map((_, e) => $(e).text()).get();
        const data_length = data.length;
        const dataslice = elements.slice(1, data_length / 2);
        return "";
    }
    static getMessageError(error) {
        if (error instanceof Error)
            return error.message;
        console.log("Error: " + error);
        return String(error);
    }
    static formatDate(date) {
        // Get day, month, and year
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getUTCFullYear();
        // Return the formatted date string
        return `${day}/${month}/${year}`;
    }
    static writeToJSON(genericInfo, index) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Read existing data
                let existingData = [];
                try {
                    const fileContent = yield promises_1.default.readFile('saved.json', 'utf-8');
                    existingData = JSON.parse(fileContent);
                }
                catch (error) {
                    // File doesn't exist or is empty, start with an empty array
                }
                // Add new data
                existingData.push(Object.assign({ index }, genericInfo));
                // Write updated data back to file
                yield promises_1.default.writeFile('saved.json', JSON.stringify(existingData, null, 2));
                console.log('Data appended successfully');
            }
            catch (err) {
                console.error('Error writing to file:', err);
            }
        });
    }
}
exports.default = GetInfo;
