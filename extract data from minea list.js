// Function to convert abbreviated numbers with 'k' to full numbers
function convertKToFullNumber(abbreviatedNumber) {
  if (abbreviatedNumber.toLowerCase().includes('k')) {
    let baseNumber = parseFloat(abbreviatedNumber.replace('k', ''));
    return baseNumber * 1000;
  } else {
    return parseFloat(abbreviatedNumber); // Ensure the return value is a number
  }
}

// Function to convert dates to days only
function convertDateToDays(dateString) {
  const datePattern = /(\d+)\s+(day|month|year)s?/;
  const match = dateString.match(datePattern);
  if (match) {
    const number = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 'day':
        return number;
      case 'month':
        return number * 30; // Assuming 1 month = 30 days
      case 'year':
        return number * 365; // Assuming 1 year = 365 days
      default:
        return dateString;
    }
  } else {
    return dateString;
  }
}

// Function to sum up likes, comments, and shares
function sumInteractions(data) {
  return data.map(item => {
    const totalInteractions = item.likes + item.comments + item.shares;
    return { ...item, totalInteractions };
  });
}

// Function to calculate the median of an array of numbers
function calculateMedian(numbers) {
  const sortedNumbers = numbers.slice().sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedNumbers.length / 2);
  if (sortedNumbers.length % 2 === 0) {
    return (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2;
  } else {
    return sortedNumbers[middleIndex];
  }
}

// Function to extract data from the page
function extractData() {
  let extractedData = [];
  let posts = document.querySelectorAll('a[href^="/en/ads/facebook/"]');

  posts.forEach(post => {
    let name = post.querySelector('h3')?.textContent.trim();
    let link = `https://app.minea.com${post.getAttribute('href')}`;
    let creationDate = post.querySelector('button[data-state="closed"] div')?.textContent.trim();
    let likes = convertKToFullNumber(post.querySelector('div > div > div > span').textContent.trim());
    let comments = convertKToFullNumber(post.querySelectorAll('div > div > div > span')[1].textContent.trim());
    let shares = convertKToFullNumber(post.querySelectorAll('div > div > div > span')[2].textContent.trim());
    let imageUrl = post.querySelector('img')?.src;
    let creationDays = convertDateToDays(creationDate);

    extractedData.push({ name, link, creationDate: creationDays, likes, comments, shares, imageUrl });
  });

  // Sum up interactions and add to data
  let summedData = sumInteractions(extractedData);
  // Calculate median of total interactions
  let medianTotalInteractions = calculateMedian(summedData.map(item => item.totalInteractions));

  return { summedData, medianTotalInteractions };
}

// Function to convert data to CSV format
function convertToCSV(data) {
  const columns = "Name,Link,Creation Date,Likes,Comments,Shares,Total Interactions,Image URL\n";
  const csvData = data.summedData.map(item => {
    return `"${item.name}","${item.link}","${item.creationDate}","${item.likes}","${item.comments}","${item.shares}","${item.totalInteractions}","${item.imageUrl}"`;
  }).join('\n');

  return columns + csvData + `\nMedian,"${data.medianTotalInteractions}"`;
}

// Function to download the data as a CSV file
function downloadCSV(data) {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'extracted_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Extract the data using the previously defined extractData function
const extractedData = extractData();
// Download the data as a CSV file
downloadCSV(extractedData);
