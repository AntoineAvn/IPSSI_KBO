import * as cheerio from 'cheerio';
import fs from 'fs/promises';

const BASE_URL = "https://www.companyweb.be/search?query=";

interface IGenericInformation {
    VAT: string;
    Full_name: string;
    Address: string;
    Established: string;
    Principal_activity: string;
    Type: string
}

export default class GetInfo {
    static async request_website(url: string, number_establishment?: string): Promise<string> {
        console.log(`${url}${number_establishment ? number_establishment : ""} \n`)
        try {
            const req = await fetch(`${url}${number_establishment ? number_establishment : ""}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                }
            });
            return await req.text();
        } catch (error) {
            console.error(GetInfo.getMessageError(error));
            return GetInfo.getMessageError(error);
        }
    }

    static async loop_every_establishment(number_establishment: string): Promise<void> {
        try {
            const get_list_establishment = await GetInfo.request_website(BASE_URL, number_establishment);
            const $ = cheerio.load(get_list_establishment);
            const list_establishment_tr = $(".tr-anchor");
            let test: any[] = [];
            list_establishment_tr.each((index, element) => {
                const link = $(element).attr("href") || '';
                (async ()=> {
                    const data = await GetInfo.request_website("https://www.companyweb.be" + link);
                    const info_gen = await GetInfo.get_generic_info(data);
                    await GetInfo.writeToJSON(info_gen!, index);
                })()
                
            });
            console.log(test);
        } catch (error) {
            console.error(GetInfo.getMessageError(error));
        }
    }

    static async get_generic_info(html: string): Promise<IGenericInformation | null> {
        if (html === "") return null;
        const $ = cheerio.load(html);
        const genericInfo: IGenericInformation = {
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
            if (elements.length === 0) return;
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
                const date_get = new Date(elementText)
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
    }

    static financial_situation(html: string): string | null {
        if (html === "") return null;
        const $ = cheerio.load(html);
        const financial_situation = $(".may-overflow-x");
        if (financial_situation.length === 0) return null;
        const elements = $(".may-overflow-x .start-tab").map((_, e) => $(e).text()).get();
        const years = $(".may-overflow-x th").map((_, e) => $(e).text()).get();
        const data = $(".may-overflow-x .financial-number").map((_, e) => $(e).text()).get();
        const data_length = data.length;

        const data_info:string[][] = [];
        const numberOfElement = $('tbody').first().children().length;
        GetInfo.order_data(data_info, $, numberOfElement);
        
        
        const def = data_info.map(d => d.shift());
        const firstyear = data_info.map(d => d.shift());
        const secondyear = data_info.map(d => d.splice(0,2));
        const thirdyear = data_info.map(d => d.splice(0,2));
        const fourthyear = data_info.map(d => d.splice(0,2));



        return "";
    }

    static order_data(data: string[][], $: cheerio.CheerioAPI, numberOfElement: number) {

        $('tbody').first().children().each((p, row) => {
          if (p < numberOfElement) {
            const rowData = $(row).children().map((_, cell) => $(cell).text().trim()).get();
            data.push(rowData);
          }
        });
      }

    static getMessageError(error: unknown): string {
        if (error instanceof Error) return error.message;
        console.log("Error: " + error);
        return String(error);
    }

    static formatDate(date: Date) {

        // Get day, month, and year
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getUTCFullYear();
    
        // Return the formatted date string
        return `${day}/${month}/${year}`;
    }

    static async writeToJSON(genericInfo: IGenericInformation, index: number): Promise<void> {
        try {
            // Read existing data
            let existingData: any[] = [];
            try {
                const fileContent = await fs.readFile('saved.json', 'utf-8');
                existingData = JSON.parse(fileContent);
            } catch (error) {
                // File doesn't exist or is empty, start with an empty array
            }

            // Add new data
            existingData.push({ index, ...genericInfo });

            // Write updated data back to file
            await fs.writeFile('saved.json', JSON.stringify(existingData, null, 2));
            
            console.log('Data appended successfully');
        } catch (err) {
            console.error('Error writing to file:', err);
        }
    }
}