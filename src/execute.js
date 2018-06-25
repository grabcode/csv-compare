const Stream = require('stream');
const csv = require('csvtojson');
const fs = require('fs');
const Json2csvTransform = require('json2csv').Transform;

const getJSON = async (filePath, csvConfig = {}) => {
  return csv(csvConfig).fromFile(filePath);
}

const saveAsCSV = (filePath, json, customFields) => {
  const fields = customFields || Object.keys(json[0]);
  const opts = { fields };
  const transformOpts = { highWaterMark: 16384, encoding: 'utf-8' };

  const stream = new Stream.Readable();
  stream.push(JSON.stringify(json)); // stream apparently does not accept objects
  stream.push(null);
  const output = fs.createWriteStream(filePath, { encoding: 'utf8' });
  const json2csv = new Json2csvTransform(opts, transformOpts);

  const processor = stream.pipe(json2csv).pipe(output);

  // You can also listen for events on the conversion and see how the header or the lines are coming out.
  // json2csv
  //   .on('header', header => console.log(header))
  //   .on('line', line => console.log(line))
  //   .on('error', err => console.log(err));

  return processor;
}

const buildIndexBy = (key, arr) => arr.reduce((acc, row, index) => {
  return {
    ...acc,
    [row[key]]: {
      ...row,
      'Line number': index + 2, // compensate the header's line + array index starts at 0
    },
  };
}, {});

exports.execute = async (oldFilePath, newFilePath, destinationFolder, config) => {
  const [oldJSON, newJSON] = await Promise.all([
    getJSON(oldFilePath, config.CSV_CONFIG),
    getJSON(newFilePath, config.CSV_CONFIG),
  ]);

  const TOTAL_ITEMS = oldJSON.length + newJSON.length;
  console.info('TOTAL ITEMS NUMBER: ', TOTAL_ITEMS)
  console.info('> OLD FILE ITEMS NUMBER: ', oldJSON.length);
  console.info('> NEW FILE ITEMS NUMBER: ', newJSON.length);

  const newJSONIndexed = buildIndexBy(config.NEW_FILE_COLUMN, newJSON);
  const length = Object.keys(newJSONIndexed).length;
  if (length != newJSON.length) {
    console.warn('WARNING! some keys are similar');
  }

  const deletedOutput = [];
  const unchangedOutput = [];

  oldJSON.forEach((row, index) => {
    const keyValue = row[config.OLD_FILE_COLUMN];
    const newJSONRow = newJSONIndexed[keyValue];
    if (newJSONRow) {
      // Support Item Number	Support Item	Support Item Description	Support Categories	Unit of Measure n	Quote	Unit of Measure n+1	Price Limit	Price Limit n+1	Price Control n	Price Control n+1
      unchangedOutput.push({
        'Support Item Number': row['Support Item Number'],
        'Support Item': row['Support Item'],
        'Support Item Description': row['Support Item Description'],
        'Support Categories': row['Support Categories'],
        'Unit of Measure n': row['Unit of Measure'],
        'Unit of Measure n+1': newJSONRow['Unit of Measure'],
        'Quote n': row['Quote'],
        'Quote n+1': newJSONRow['Quote'],
        'Price Limit n': row['Price'],
        'Price Limit n+1': newJSONRow['Price Limit'],
        'Price Control n': row['Price Control'],
        'Price Control n+1': newJSONRow['Price Control'],
        'Line number n': index,
        'Line number n+1': newJSONRow['Line number'],
      });
      delete newJSONIndexed[keyValue];
    } else {
      deletedOutput.push({
        ...row,
        'Price Limit': row['Price'], // TODO move in config
        'Line number': index,
      });
    }
  });

  // recompose `newOutput` array from remaining newJSONIndexed
  const newOutput = Object.keys(newJSONIndexed).map(key => {
    return newJSONIndexed[key];
  });

  const POST_OPERATION_ITEMS_NB = newOutput.length + deletedOutput.length + unchangedOutput.length * 2;
  const SANITY_CHECK_TOTAL = TOTAL_ITEMS == POST_OPERATION_ITEMS_NB;
  const SANITY_CHECK_NEW = newJSON.length == (newOutput.length + unchangedOutput.length);
  const SANITY_CHECK_OLD = oldJSON.length == (deletedOutput.length + unchangedOutput.length);
  if (!SANITY_CHECK_TOTAL || !SANITY_CHECK_OLD || !SANITY_CHECK_NEW) {
    console.warn('WARNING! SANITY CHECK FAILED. Total:', SANITY_CHECK_TOTAL);
    console.warn('WARNING! SANITY CHECK FAILED. Old:', SANITY_CHECK_OLD);
    console.warn('WARNING! SANITY CHECK FAILED. New:', SANITY_CHECK_NEW);
  } else {
    const TOTAL_UNIQ_ITEMS = newOutput.length + deletedOutput.length + unchangedOutput.length;
    console.info("**** **** ****");
    console.info("SUCCESS, SANITY CHECK IS PASSING");
    console.info("TOTAL NUMBER OF UNIQUE ITEMS:", TOTAL_UNIQ_ITEMS);
    console.info("> NEW ITEMS NUMBER:", newOutput.length);
    console.info("> DELETED ITEMS NUMBER:", deletedOutput.length);
    console.info("> UNCHANGED ITEMS NUMBER:", unchangedOutput.length);

    saveAsCSV(
      `${destinationFolder}/${config.NEW_ITEMS_FILENAME}.csv`,
      newOutput,
      config.NEW_ITEMS_FIELDS,
    );
    saveAsCSV(
      `${destinationFolder}/${config.DELETED_ITEMS_FILENAME}.csv`,
      deletedOutput,
      config.DELETED_ITEMS_FIELDS,
    );
    saveAsCSV(
      `${destinationFolder}/${config.UNCHANGED_ITEMS_FILENAME}.csv`,
      unchangedOutput,
    );
  }
}
