#!/bin/bash

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RESULTS_DIR="test results"
ROOT_DIR=$(pwd)

echo "Starting full test suite run..."
echo "Timestamp: $TIMESTAMP"
mkdir -p "$RESULTS_DIR"

# 1. Backend Unit Tests
echo "Running Backend Unit tests..."
cd "$ROOT_DIR/backend"
vendor/bin/codecept run Unit --html "unit_report.html" --no-ansi > /dev/null 2>&1
mv "tests/_output/unit_report.html" "../$RESULTS_DIR/backend_unit_$TIMESTAMP.html"

# 2. Backend API Tests
echo "Running Backend API tests..."
cd "$ROOT_DIR/backend"
vendor/bin/codecept run Api --html "api_report.html" --no-ansi > /dev/null 2>&1
mv "tests/_output/api_report.html" "../$RESULTS_DIR/backend_api_$TIMESTAMP.html"

# 3. Frontend Unit Tests
echo "Running Frontend Unit tests..."
cd "$ROOT_DIR/frontend"
npx vitest run --reporter=json --outputFile="results_$TIMESTAMP.json" > /dev/null 2>&1
node json-to-html.js "results_$TIMESTAMP.json" "frontend_unit_$TIMESTAMP.html" > /dev/null 2>&1
mv "frontend_unit_$TIMESTAMP.html" "../$RESULTS_DIR/"
rm "results_$TIMESTAMP.json"

# 4. E2E Tests
echo "Running E2E tests..."
cd "$ROOT_DIR/e2e"
npx playwright test --reporter=html --workers=1 > /dev/null 2>&1
# The Playwright HTML report is in playwright-report/index.html
# We move it and also move the assets/data if they are needed, 
# but per user request we just move the file to a timestamped name.
cp "playwright-report/index.html" "../$RESULTS_DIR/e2e_report_$TIMESTAMP.html"
# To ensure it works, we also copy the assets if they exist (Playwright needs them for some views)
if [ -d "playwright-report/assets" ]; then
    mkdir -p "../$RESULTS_DIR/assets"
    cp -r playwright-report/assets/* "../$RESULTS_DIR/assets/"
fi

echo "------------------------------------------"
echo "All tests completed!"
echo "Reports generated in '$RESULTS_DIR':"
echo "  - backend_unit_$TIMESTAMP.html"
echo "  - backend_api_$TIMESTAMP.html"
echo "  - frontend_unit_$TIMESTAMP.html"
echo "  - e2e_report_$TIMESTAMP.html"
echo "------------------------------------------"
