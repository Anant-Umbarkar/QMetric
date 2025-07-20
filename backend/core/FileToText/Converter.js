const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const Tesseract = require('tesseract.js');

async function convertPDFToText(inputFilePath, outputTextFilePath) {
    const dataBuffer = fs.readFileSync(inputFilePath);
    const data = await pdf(dataBuffer);
    const text = data.text;
    fs.writeFileSync(outputTextFilePath, text);
    return text;
}

async function convertWordToText(inputFilePath, outputTextFilePath) {
    try {
        const dataBuffer = fs.readFileSync(inputFilePath);
        const result = await mammoth.extractRawText(dataBuffer);
        const text = result.value;
        fs.writeFileSync(outputTextFilePath, text);
        return text;
    } catch (error) {
        console.error('Error converting Word document to text:', error);
        throw error;
    }
}


async function convertCSVToText(inputFilePath, outputTextFilePath) {
    const rows = [];
    fs.createReadStream(inputFilePath)
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', () => {
            const text = JSON.stringify(rows, null, 2);
            fs.writeFileSync(outputTextFilePath, text);
        });
}

async function convertXLSXToText(inputFilePath, outputTextFilePath) {
    const workbook = xlsx.readFile(inputFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    const text = JSON.stringify(rows, null, 2);
    fs.writeFileSync(outputTextFilePath, text);
}

async function convertImageToText(inputImagePath, outputTextFilePath) {
    return new Promise((resolve, reject) => {
        Tesseract.recognize(
            inputImagePath,
            'eng',
            { logger: info => console.log(info) }
        ).then(({ data: { text } }) => {
            fs.writeFileSync(outputTextFilePath, text);
            resolve(text);
        }).catch(error => {
            reject(error);
        });
    });
}

module.exports = {
    convertPDFToText,
    convertWordToText,
    convertCSVToText,
    convertXLSXToText,
    convertImageToText
};  
