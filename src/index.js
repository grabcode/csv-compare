const path = require('path');
const { buildConfig } = require('./config');
const { execute } = require('./execute');
const program = require('commander');

const CONFIG = buildConfig({
  APP_ROOT: path.resolve(__dirname),
  OLD_FILE_COLUMN: 'Support Item Number',
  NEW_FILE_COLUMN: 'Support Item Number',
  CSV_CONFIG: {
    flatKeys: true,
    trim: true,
  },
  NEW_ITEMS_FILENAME: 'NEW_ITEMS',
  NEW_ITEMS_FIELDS: ['Support Item Number', 'Support Item', 'Support Item Description',	'Support Categories',	'Unit of Measure', 'Quote', 'Price Limit',	'Price Control', 'Line number'],
  DELETED_ITEMS_FILENAME: 'DELETED_ITEMS',
  DELETED_ITEMS_FIELDS: ['Support Item Number', 'Support Item', 'Support Item Description',	'Support Categories',	'Unit of Measure', 'Quote', 'Price Limit',	'Price Control', 'Line number'],
  UNCHANGED_ITEMS_FILENAME: 'UNCHANGED_ITEMS',
});

// const WORKING_FOLDER = `${CONFIG.FILE_ROOT}/ACT`;
// const oldFilePath = `${WORKING_FOLDER}/201718-ACT-NT-SA-WA-Price-Guide-30Oct.csv`;
// const newFilePath = `${WORKING_FOLDER}/201819-ACT-NT-SA-WA-Price-Guide.csv`;
//
// execute(oldFilePath, newFilePath, WORKING_FOLDER, CONFIG);

program
  .version('0.1.0')
  .arguments('<oldFilePath> <newFilePath> <destinationFolder>')
  // .option('-o, --old-filepath', 'Old file path')
  // .option('-n, --new-filepath', 'New file path')
  // .option('-d, --destination-folder', 'Destination folder of the output CSV')
  .action(function(oldFilePath, newFilePath, destinationFolder) {
    console.log('Comparing CSV:');
    // if (program.oldFilePath) console.log('  - oldFilePath');
    // if (program.newFilepath) console.log('  - newFilepath');
    console.log('  - old filepath: %s', oldFilePath);
    console.log('  - new filepath: %s', newFilePath);
    console.log('  - destination folder: %s', destinationFolder);

    execute(oldFilePath, newFilePath, destinationFolder, CONFIG);
  })
  .parse(process.argv);
