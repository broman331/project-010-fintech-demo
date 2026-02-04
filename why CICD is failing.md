# Why CI/CD is Failing

Our investigation into the latest CI failures (Run #3) has identified three critical root causes across the different jobs.

## 1. Frontend Unit & Lint Job: Missing Lockfile
*   **Symptom**: The `Setup Node` step fails with the error: `Some specified paths were not resolved, unable to cache dependencies.`
*   **Root Cause**: The **root `.gitignore`** file contains an over-aggressive rule: `/frontend/*.json`. While there are "unignore" (negation) rules for `package.json` and `tsconfig.json`, there is NO negation for `package-lock.json`. 
*   **Result**: Consequently, `package-lock.json` was never committed to the repository. The GitHub Action `actions/setup-node` is configured to use this file for caching (`cache-dependency-path: frontend/package-lock.json`), and it terminates when it cannot find the file.

## 2. Backend Unit & Lint Job: PHP 8.4 Dependency Conflicts
*   **Symptom**: The `Install Dependencies` step fails during `composer install`.
*   **Root Cause**: 
    1.  **PHP Version**: The CI is configured to use **PHP 8.4**. While Laravel 11 supports 8.4, several ecosystem packages or specific version constraints in our `composer.json` (minimum `^8.2`) may not yet be compatible with the strict requirements of 8.4, or may require specific flags (like `--ignore-platform-reqs` which is NOT recommended).
    2.  **Missing Extensions**: The workflow setup for PHP (`shivammathur/setup-php`) is missing common Laravel extensions such as `bcmath`, `exif`, and `gd`, which are required by the application (as seen in the `Dockerfile`).
*   **Result**: dependency resolution fails, preventing the unit tests and linting from execution.

## 3. API & E2E Integration Job: Docker Build Failure
*   **Symptom**: The `Start Environment` step fails during `docker-compose up -d --build`.
*   **Root Cause**: This is a cascading failure from the Backend issue. The `backend/Dockerfile` includes a `RUN composer install` step. Since this is running in a PHP 8.4 environment (as defined in the Dockerfile `FROM php:8.4-fpm-alpine`), it encounters the same dependency resolution failure mentioned above.
*   **Result**: The container build fails, the environment never starts, and therefore the database health checks and subsequent tests cannot run.

## Summary Checklist for Fixes:
- [ ] Update root `.gitignore` to unignore `frontend/package-lock.json`.
- [ ] Align PHP version in CI with a stable, tested version (e.g., 8.3) OR update all dependencies to be 8.4-compliant.
- [ ] Add missing PHP extensions (`bcmath`, `gd`, `exif`) to the GitHub Actions `setup-php` step.
- [ ] Commit and push the `frontend/package-lock.json` file.
