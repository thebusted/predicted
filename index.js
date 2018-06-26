const fs = require('fs');
const lineReader = require('readline').createInterface({
  input: fs.createReadStream('./data/result.txt'),
  crlfDelay: Infinity
});

// Create write stream
const writer = fs.createWriteStream('./data/person.csv', {
  flags: 'a'
});

// Global variables
const datetime = '2018-05-25 14:13:44';
let person = 0;
let data = [];

// Time
const time = new Date(datetime);

// Output date function
function dateStr(time) {
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const millisec = time.getMilliseconds();
  // return `${year}-${month > 9 ? month : '0' + month}-${date > 9 ? date : '0' + date} ${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}.${millisec > 99 ? millisec : (millisec > 9 ? '0' + millisec : '00' + millisec)}`;
  return `${year}-${month > 9 ? month : '0' + month}-${date > 9 ? date : '0' + date} ${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
}

// RegExp for detect persons
const pattern = new RegExp(/^(person): (\d{1,2})%$/g);

// Execute
lineReader.on('line', function (line) {
  const strLine = line.trim();

  if (strLine == 'cvWriteFrame') {
    data.push(person);
    person = 0;
  } else if (pattern.test(strLine)) {
    person++
  }
}).on('close', () => {
  // Write header
  writer.write("datetime,person\n");

  // Iterate data
  data.forEach((val, index) => {
    if (index % 30 == 0) {

      writer.write(dateStr(time) + ',' + val + "\n");
      
      // FPS = 30
      time.setSeconds(time.getSeconds() + 1);
      
      // Plus 33 millisec (1000 (millisec per second) / 30 fps)
      // time.setMilliseconds(time.getMilliseconds() + 33)
    }
  });
  writer.end();
});