import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

@Injectable()
export class ExcelService {
  readExcelFile(filePath: string): any {
    const file = fs.readFileSync(filePath);
    const workbook = XLSX.read(file, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(sheet);
  }

  readExcelBuffer(buffer: any): any {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(sheet);
  }
}
