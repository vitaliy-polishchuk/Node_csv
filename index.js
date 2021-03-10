const csv = require('csv-parser')
const fs = require('fs')
const results = [];


const unique = (arr) =>{
    const uniqueEl = [];
    for(let i = 0; i < arr.length; i++){
        if(!uniqueEl.includes(arr[i])){
            uniqueEl.push(arr[i])
        }
    }
    return uniqueEl
}
const reformatDate = (oldDate) =>{
    const unixTimestamp = Date.parse(oldDate)
    const date = new Date (unixTimestamp)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth()+1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return year + '-' + month + '-' + day


}

const csvWriterLibrary = require('csv-writer')

fs.createReadStream('./file/acme_worksheet.csv')
    .pipe(csv())
    .on('data', (data) => {
        results.push(data)

    })
    .on('end', () => {

        const employeeNames = results.map(item => item['Employee Name'])
        const uniqueEmployeeNames = unique(employeeNames)

        const dates = results.map(item=> item.Date)
        const uniqueDates = unique(dates)

        const header = [
            {id: 'name', title: 'Name / Date'},

        ]

        for (let i = 0; i < uniqueDates.length; i++){
            header.push({id: i.toString(), title: reformatDate(uniqueDates[i])})
        }

        const objectCsvWriter = csvWriterLibrary.createObjectCsvWriter({
            path: './file/output.csv',
            header: header
        });
            const output = []
            for(let i = 0; i < uniqueEmployeeNames.length; i++){
                const row = {name: uniqueEmployeeNames[i]}
                for(let j = 0; j < uniqueDates.length; j++){
                    const result = results.find(item => item['Employee Name'] === uniqueEmployeeNames[i] && item.Date === uniqueDates[j] )
                    if(result){
                        row[j.toString()] = result['Work Hours']
                    }else {
                        row[j.toString()] = 0
                    }

                }
                output.push(row)
            }

        objectCsvWriter.writeRecords(output)
            .then(() => {
                console.log('...Done');
            });
    });


