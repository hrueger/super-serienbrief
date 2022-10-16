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
    const skipIndex = header.indexOf("_skip");

    const inputs = rows
        .filter((row) => skipIndex === -1 || !row[skipIndex])
        .map(row => {
        const input: Record<string, any> = {...textFiles};
        for (let i = 0; i < header.length; i++) {
            const h = (header[i] || "").toString();
            const r = (row[i] || "").toString();
            input[h] = template.schemas[0][h]?.type === 'image' && imageFiles[r] ? imageFiles[r] : r;
        }
        return input;
    });

    const pdf = await generate({ template, inputs });
    fs.writeFileSync(`output.pdf`, pdf);
})();