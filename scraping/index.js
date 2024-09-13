"use strict";
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
const getInfo_1 = __importDefault(require("./utils/getInfo"));
const csv_parse_1 = require("csv-parse");
const fs_1 = __importDefault(require("fs"));
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const headers = ['EnterpriseNumbername', 'Status', 'JuridicalSituation', 'TypeOfEnterprise', 'JuridicalForm', 'JuridicalFormCAC', 'StartDate'];
    const fileContent = fs_1.default.readFileSync("enterprise.csv", { encoding: 'utf-8' });
    (0, csv_parse_1.parse)(fileContent, {
        delimiter: ',',
        columns: headers,
    }, (error, result) => {
        if (error) {
            console.error(error);
        }
        result.forEach((r) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(r);
            yield getInfo_1.default.loop_every_establishment(r.EnterpriseNumbername);
        }));
    });
});
run();
