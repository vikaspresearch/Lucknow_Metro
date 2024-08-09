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
    const stationToken = 
`% This file is used by to initialise
% the station property for individual train
% (Station Name, distance from previous station, distance to next station, allowed speed, maximum allowed speed, acceleration, deacceleration), train number
1\`(("${stationName}",${distPrevStation}.0,${distNextStation}.0, ${allowedSpeed}.0, ${allowedMaxSpeed}.0,${acceleration}.0, ${deacceleration}), 1)++
1\`(("${stationName}",${distPrevStation}.0,${distNextStation}.0, ${allowedSpeed}.0, ${allowedMaxSpeed}.0,${acceleration}.0, ${deacceleration}), 2)++
1\`(("${stationName}",${distPrevStation}.0,${distNextStation}.0, ${allowedSpeed}.0, ${allowedMaxSpeed}.0,${acceleration}.0, ${deacceleration}), 3)++
1\`(("${stationName}",${distPrevStation}.0,${distNextStation}.0, ${allowedSpeed}.0, ${allowedMaxSpeed}.0,${acceleration}.0, ${deacceleration}), 4)++
1\`(("${stationName}",${distPrevStation}.0,${distNextStation}.0, ${allowedSpeed}.0, ${allowedMaxSpeed}.0,${acceleration}.0, ${deacceleration}), 5)++
1\`(("${stationName}",${distPrevStation}.0,${distNextStation}.0, ${allowedSpeed}.0, ${allowedMaxSpeed}.0,${acceleration}.0, ${deacceleration}), 6)++
1\`(("${stationName}",${distPrevStation}.0,${distNextStation}.0, ${allowedSpeed}.0, ${allowedMaxSpeed}.0,${acceleration}.0, ${deacceleration}), 7)++
1\`(("${stationName}",${distPrevStation}.0,${distNextStation}.0, ${allowedSpeed}.0, ${allowedMaxSpeed}.0,${acceleration}.0, ${deacceleration}), 8)++
1\`(("${stationName}",${distPrevStation}.0,${distNextStation}.0, ${allowedSpeed}.0, ${allowedMaxSpeed}.0,${acceleration}.0, ${deacceleration}), 9)++
1\`(("${stationName}",${distPrevStation}.0,${distNextStation}.0, ${allowedSpeed}.0, ${allowedMaxSpeed}.0,${acceleration}.0, ${deacceleration}), 10)`;
    fs.writeFileSync(`station/new_prop_${stationName}.txt`, stationToken);
}

// Generate SML tokens for each timetable
for (let i = 0; i < data.length; i++) {
    const stationName = data[i]['Station'].trim();
    const entryTime = parseInt(data[i]['Entry Time']);
    const haltTime = parseInt(data[i]['halttime']);
    const exitTime = parseInt(data[i]['Exit Time']);
    const trainNumber = 10001;
    const direction = 0;

    // Create SML token for timetable
    const timetableToken = 
`% This file is used by to initialise
% the train timetable for station
%%(name, timeHome, timeStation, timeStarter, direction), train number
1\`(("Metro1",${entryTime},${haltTime},${exitTime},${direction}),1)++
1\`(("Metro2",${entryTime+(1*150)},${haltTime+(1*150)},${exitTime+(1*150)},${direction}),2)++
1\`(("Metro3",${entryTime+(2*150)},${haltTime+(2*150)},${exitTime+(2*150)},${direction}),3)++
1\`(("Metro4",${entryTime+(3*150)},${haltTime+(3*150)},${exitTime+(3*150)},${direction}),4)++
1\`(("Metro5",${entryTime+(4*150)},${haltTime+(4*150)},${exitTime+(4*150)},${direction}),5)++
1\`(("Metro6",${entryTime+(5*150)},${haltTime+(5*150)},${exitTime+(5*150)},${direction}),6)++
1\`(("Metro7",${entryTime+(6*150)},${haltTime+(6*150)},${exitTime+(6*150)},${direction}),7)++
1\`(("Metro8",${entryTime+(7*150)},${haltTime+(7*150)},${exitTime+(7*150)},${direction}),8)++
1\`(("Metro9",${entryTime+(8*150)},${haltTime+(8*150)},${exitTime+(8*150)},${direction}),9)++
1\`(("Metro10",${entryTime+(9*150)},${haltTime+(9*150)},${exitTime+(9*150)},${direction}),10)`;
console.log(stationName)

    // Write the token to a file
    fs.writeFileSync(`timetable/new_timetable_${stationName}.txt`, timetableToken);
}

console.log('SML tokens generated successfully!');
