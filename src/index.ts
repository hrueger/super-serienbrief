import { generate, Template } from '@pdfme/generator';
import * as fs from "fs";
import readXlsxFile from 'read-excel-file/node'

(async () => {
    const template = JSON.parse(fs.readFileSync('template.json', 'utf8')) as Template;
    
    const rows = await readXlsxFile('data.xlsx');

    const imageFiles = Object.fromEntries(fs.readdirSync('.').filter((f) => f.match(/\.png|\.jpg|\.jpeg$/i)).map(((f) => [
        f.match(/(.*)\.[^.]+$/)![1],
        `data:image/${f.match(/\.png$/i) ? 'png' : 'jpeg'};base64,${fs.readFileSync(f, 'base64')}`
    ])));
    const textFiles = Object.fromEntries(fs.readdirSync('.').filter((f) => f.match(/\.txt$/i)).map(((f) => [
        f.match(/(.*)\.[^.]+$/)![1],
        fs.readFileSync(f, 'utf8')
    ])));

    const header = rows.shift()!;

    const inputs = rows.map(row => {
        const input: Record<string, any> = {};
        for (let i = 0; i < header.length; i++) {
            input[header[i].toString()] = template.schemas[0][header[i].toString()]?.type === 'image' && imageFiles[row[i].toString()] ? imageFiles[row[i].toString()] : textFiles[row[i].toString()] ?? row[i].toString();
        }
        return input;
    });

    const pdf = await generate({ template, inputs });
    fs.writeFileSync(`output.pdf`, pdf);
})();