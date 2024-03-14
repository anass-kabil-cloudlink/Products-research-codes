function getMedianRows() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var allSheets = ss.getSheets();
  var medianRows = [];

  allSheets.forEach(function(sheet) {
    var firstColumn = sheet.getRange('A:A').getValues(); // Get all data from the first column
    firstColumn.forEach(function(cell, index) {
      if (cell[0].toString().toLowerCase() === 'median') {
        var lastColumn = sheet.getLastColumn(); // Get the last column index for the current sheet
        var rowRange = sheet.getRange(index + 1, 1, 1, lastColumn);
        var rowData = rowRange.getValues()[0];
        var sheetNameWithMedian = sheet.getName() + '+median';
        var standardizedRow = [sheetNameWithMedian].concat(rowData);
        medianRows.push(standardizedRow);
      }
    });
  });

  // Write the medianRows to the 'MedianRows' sheet
  var targetSheet = ss.getSheetByName('MedianRows');
  if (!targetSheet) {
    targetSheet = ss.insertSheet('MedianRows');
  } else {
    targetSheet.clear();
  }
  // Find the length of the longest row
  var longestRowLength = medianRows.reduce(function(maxLength, row) {
    return Math.max(maxLength, row.length);
  }, 0);
  // Ensure all rows have the same number of columns
  medianRows = medianRows.map(function(row) {
    return row.concat(Array(longestRowLength - row.length).fill(''));
  });
  targetSheet.getRange(1, 1, medianRows.length, longestRowLength).setValues(medianRows);
}
