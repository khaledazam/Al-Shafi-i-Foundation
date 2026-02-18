const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'frontend/src/data/colorNames.json');

try {
    const content = fs.readFileSync(targetFile, 'utf8');
    const lines = content.trim().split('\n');

    // Header: name,hex,good name
    const headers = lines[0].split(',').map(h => h.trim());

    const jsonResult = lines.slice(1).map(line => {
        // Simple comma split since values don't seem to contain commas in the preview
        const parts = line.split(',');
        return {
            name: parts[0] || '',
            hex: parts[1] || '',
            goodName: parts[2] === 'x' ? true : false
        };
    });

    fs.writeFileSync(targetFile, JSON.stringify(jsonResult, null, 2), 'utf8');
    console.log('Conversion successful. Wrote ' + jsonResult.length + ' colors.');
} catch (err) {
    console.error('Error during conversion:', err);
    process.exit(1);
}
