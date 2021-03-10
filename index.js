const csv = require('csv-parser')
const fs = require('fs')
const results = [];

// 1. import library
const csvWriterLibrary = require('csv-writer')

fs.createReadStream('./file/acme_worksheet.csv')
    .pipe(csv())
    .on('data', (data) => {
        results.push(data)

    })
    .on('end', () => {
        console.log(results);


        const header = [
            {id: 'Employee Name', title: 'NAME / DATE'},
            {id: 'Date', title: results.map(date => date.Date)},
        ]


        const objectCsvWriter = csvWriterLibrary.createObjectCsvWriter({
            path: './file/output.csv',
            header: header
        });


        objectCsvWriter.writeRecords(results)
            .then(() => {
                console.log('...Done');
            });
    });


