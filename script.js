// Use your Google Sheet ID from the URL
const sheetId = '1uUGWMgw8oNTswDJBz8se0HxPMEqRk0keJtFNlhaZoj0';
// The name of the sheet tab where your data is (default called 'Sheet1' but use actual sheet name if different)
const sheetName = 'Sheet1';

// URL to fetch the sheet as JSON using Google Visualization API
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${sheetName}&tq=select%20*`;

function createAnimeCards(data) {
  let html = '';
  data.forEach(row => {
    const no = row[0] || '';
    const thumbnail = row[1] || '';
    const name = row[2] || '';
    const description = row[3] || '';
    const link = row[4] || '';

    html += `
      <div class="anime-card">
        <img src="${thumbnail}" alt="${name}" />
        <h3>${name}</h3>
        <p>${description}</p>
        <a href="${link}" target="_blank">Watch Now</a>
      </div>`;
  });
  return html;
}

fetch(url)
  .then(res => res.text())
  .then(rep => {
    // The response is JSON wrapped inside some JavaScript function call, so we parse it accordingly
    const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
    // Extract rows of data
    const rows = jsonData.table.rows;
    // Map rows to array of cell values
    const data = rows.map(r => r.c.map(cell => cell ? cell.v : ''));
    // Remove header row if present (which contains column names)
    data.shift();

    // Create anime cards HTML and inject into the DOM
    document.getElementById('anime-list').innerHTML = createAnimeCards(data);

    // For now, reuse the same data for slides if needed (you can modify or create separate sheet later)
    // You can similarly inject slide cards in your carousel-track div
  })
  .catch(err => console.error('Error fetching sheet data:', err));
