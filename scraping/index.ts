import GetInfo from "./utils/getInfo"
import { parse } from 'csv-parse';
import fs from "fs";

type CSVEnterprise = {
   EnterpriseNumbername: string,
   Status: string,
   JuridicalSituation: string,
   TypeOfEnterprise: string,
   JuridicalForm: string,
   JuridicalFormCAC: string,
   StartDate: string
}

const run = async (VAT: string) => {
   /*const headers = ['EnterpriseNumbername', 'Status', 'JuridicalSituation', 'TypeOfEnterprise', 'JuridicalForm', 'JuridicalFormCAC', 'StartDate'];
   const fileContent = fs.readFileSync("enterprise.csv", { encoding: 'utf-8' });
  
  parse(fileContent, {
    delimiter: ',',
    columns: headers,
  }, (error, result: CSVEnterprise[]) => {
    if (error) {
      console.error(error);
    }
    result.forEach(async(r) => {
      console.log(r)
      await GetInfo.loop_every_establishment(r.EnterpriseNumbername);
    })
  });*/
  await GetInfo.loop_every_establishment(VAT)
}

run("0200.171.970")