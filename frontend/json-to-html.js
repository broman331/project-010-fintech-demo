import fs from 'fs';
import path from 'path';

const inputFile = process.argv[2] || 'frontend_unit_results.json';
const outputFile = process.argv[3] || 'frontend_unit_report.html';

if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
}

const json = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const startTime = json.startTime || Date.now();
const endTime = Date.now();

let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Frontend Unit Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; max-width: 1000px; margin: 0 auto; }
        h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #dee2e6; display: flex; gap: 20px; }
        .metric { display: flex; flex-direction: column; }
        .metric-label { font-size: 0.85em; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-value { font-size: 1.5em; font-weight: bold; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        th, td { border: 1px solid #dee2e6; padding: 12px; text-align: left; }
        th { background-color: #f1f3f5; color: #495057; font-weight: 600; }
        tr:nth-child(even) { background-color: #f8f9fa; }
        tr:hover { background-color: #e9ecef; }
        .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.85em; font-weight: bold; text-align: center; display: inline-block; min-width: 60px; }
        .badge-passed { background-color: #d4edda; color: #155724; }
        .badge-failed { background-color: #f8d7da; color: #721c24; }
        .fail-msg { white-space: pre-wrap; color: #dc3545; font-family: monospace; font-size: 0.9em; margin-top: 5px; background: #fff5f5; padding: 10px; border-radius: 4px; }
        .suite-name { color: #004085; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Frontend Unit Test Report</h1>
    <div class="summary">
        <div class="metric">
            <span class="metric-label">Total</span>
            <span class="metric-value">${json.numTotalTests}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Passed</span>
            <span class="metric-value passed">${json.numPassedTests}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Failed</span>
            <span class="metric-value failed">${json.numFailedTests}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Duration</span>
            <span class="metric-value">${((endTime - startTime) / 1000).toFixed(2)}s</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 20%">Test Suite</th>
                <th style="width: 40%">Test Case</th>
                <th style="width: 10%">Status</th>
                <th style="width: 10%">Duration</th>
                <th style="width: 20%">Message</th>
            </tr>
        </thead>
        <tbody>
`;

const projectRoot = process.cwd();

json.testResults.forEach(suite => {
    const suiteName = suite.name.replace(projectRoot + '/', '');

    suite.assertionResults.forEach(test => {
        const isPassed = test.status === 'passed';
        const badgeClass = isPassed ? 'badge-passed' : 'badge-failed';
        const statusText = test.status.toUpperCase();

        html += `
            <tr>
                <td class="suite-name">${suiteName}</td>
                <td>${test.title}</td>
                <td><span class="status-badge ${badgeClass}">${statusText}</span></td>
                <td>${test.duration ? Math.round(test.duration) + 'ms' : '-'}</td>
                <td>${test.failureMessages.length ? '<div class="fail-msg">' + test.failureMessages.join('\n').replace(/</g, '&lt;') + '</div>' : ''}</td>
            </tr>
        `;
    });
});

html += `
        </tbody>
    </table>
    <p style="text-align: center; margin-top: 30px; color: #999; font-size: 0.8em;">Generated via custom Vitest JSON-to-HTML reporter</p>
</body>
</html>
`;

fs.writeFileSync(outputFile, html);
console.log(`Report generated: ${outputFile}`);
