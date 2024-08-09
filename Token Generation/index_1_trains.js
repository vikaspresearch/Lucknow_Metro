const xlsx = require('xlsx');
const fs = require('fs');

// Read the Excel sheet data
const workbook = xlsx.readFile('tokens.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(worksheet);

// Create separate folders for timetable and station data
try{
    fs.mkdirSync('timetable');
    fs.mkdirSync('station');    
}catch (e){

}

// Generate SML tokens for each station
for (let i = 0; i < data.length; i++) {
    const stationName = data[i]['Station'].trim();
    const distPrevStation = parseFloat(data[i]['Dist']);
    let nxtSt=0;
    if(data[i + 1]){
        nxtSt=data[i + 1]['Dist'];
    }
    const distNextStation = parseFloat(nxtSt);
    const allowedSpeed = 32.0;
    const allowedMaxSpeed = 85.0;
    const acceleration = 1.0;
    const deacceleration = 1.2;

    // Create SML token for station property
    const stationToken = `1\`{name="${stationName}", id=${i + 1001}, distPrevStation=${distPrevStation}.0, distNextStation=${distNextStation}.0, allowedSpeed=${allowedSpeed}.0, allowedMaxSpeed=${allowedMaxSpeed}.0, acceleration=${acceleration}.0, deacceleration=${deacceleration}}`;

    console.log(stationToken);
    // Write the token to a file
    fs.writeFileSync(`station/prop_${stationName}.txt`, stationToken);
}

// Generate SML tokens for each timetable
for (let i = 0; i < data.length - 1; i++) {
    const stationName = data[i]['Station'].trim();
    const entryTime = parseInt(data[i]['Entry Time']);
    const haltTime = parseInt(data[i]['halttime']);
    const exitTime = parseInt(data[i]['Exit Time']);
    const trainNumber = 10001;
    const direction = 0;

    // Create SML token for timetable
    const timetableToken = `1\`{number=${trainNumber}, timeHome=${entryTime}, timeStation=${haltTime}, timeStarter=${exitTime}, direction=${direction}}`;

    // Write the token to a file
    fs.writeFileSync(`timetable/prop_${stationName}.txt`, timetableToken);
}

console.log('SML tokens generated successfully!');
