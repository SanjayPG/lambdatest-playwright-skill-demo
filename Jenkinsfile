/**
 * Jenkinsfile — SauceDemo Playwright Test Pipeline
 *
 * Stages
 * ──────
 * 1. Checkout         – clone / fetch the repository
 * 2. Install          – npm ci + Playwright browser binaries
 * 3. Validate Config  – skill's validate-config.py (zero errors = gate)
 * 4. Lint & Type-check – tsc --noEmit
 * 5. Local Tests      – both spec files on Chromium on the Jenkins agent
 * 6. LambdaTest Cloud – full cross-browser matrix via @lambdatest projects
 *                        (lambdatest-setup.ts fixture, Pattern 2 from skill)
 * 7. Publish Reports  – archive JUnit XML + HTML artefacts
 *
 * Required Jenkins credentials (Manage Jenkins → Credentials):
 *   ID: lt-credentials   Kind: Username with password
 *     Username field  → LambdaTest username
 *     Password field  → LambdaTest access key
 */

pipeline {
    agent {
        // Docker image with Node 20 + Playwright browsers pre-installed
        docker {
            image 'mcr.microsoft.com/playwright:v1.44.0-jammy'
            args  '--ipc=host'
        }
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }

    environment {
        CI         = 'true'
        BUILD_NAME = "${env.JOB_NAME}-${env.BUILD_NUMBER}"
        TEST_NAME  = 'SauceDemo Order Flow'
    }

    parameters {
        booleanParam(
            name:         'RUN_CLOUD',
            defaultValue: true,
            description:  'Run tests on LambdaTest cloud after local run'
        )
    }

    stages {

        // ── 1. Checkout ────────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ── 2. Install ─────────────────────────────────────────────────────────
        stage('Install') {
            steps {
                sh 'node --version && npm --version'
                sh 'npm ci'
                // Browsers are pre-installed in the Docker image.
                // On a bare Jenkins agent, uncomment:
                // sh 'npx playwright install --with-deps chromium firefox webkit'
            }
        }

        // ── 3. Validate Config ─────────────────────────────────────────────────
        // Skill workflow step 1: python scripts/validate-config.py
        stage('Validate Config') {
            steps {
                sh 'PYTHONIOENCODING=utf-8 npm run validate'
            }
        }

        // ── 4. Lint & Type-check ───────────────────────────────────────────────
        stage('Lint & Type-check') {
            steps {
                sh 'npm run lint'
            }
        }

        // ── 5. Local Tests ─────────────────────────────────────────────────────
        // Skill workflow step 3: npx playwright test --project=chromium
        stage('Local Tests') {
            steps {
                sh 'npm run test:chromium -- --reporter=list,junit'
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'test-results/results.xml'
                    publishHTML(target: [
                        allowMissing:          false,
                        alwaysLinkToLastBuild: true,
                        keepAll:               true,
                        reportDir:             'playwright-report',
                        reportFiles:           'index.html',
                        reportName:            'Playwright Local Report',
                    ])
                }
            }
        }

        // ── 6. LambdaTest Cloud ────────────────────────────────────────────────
        // Skill workflow step 4: npx playwright test --project="chrome:latest:Windows 11@lambdatest"
        // Uses lambdatest-setup.ts fixture (Pattern 2) — auto-reports pass/fail status.
        stage('LambdaTest Cloud') {
            when {
                expression { return params.RUN_CLOUD }
            }
            environment {
                LT_CREDENTIALS = credentials('lt-credentials')
                LT_USERNAME    = "${LT_CREDENTIALS_USR}"
                LT_ACCESS_KEY  = "${LT_CREDENTIALS_PSW}"
            }
            steps {
                sh 'npm run test:cloud -- --reporter=list,junit --output=test-results-cloud'
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'test-results-cloud/results.xml'
                    publishHTML(target: [
                        allowMissing:          false,
                        alwaysLinkToLastBuild: true,
                        keepAll:               true,
                        reportDir:             'playwright-report',
                        reportFiles:           'index.html',
                        reportName:            'Playwright LambdaTest Report',
                    ])
                }
            }
        }

    } // end stages

    post {
        always {
            archiveArtifacts artifacts: 'test-results/**,test-results-cloud/**',
                             allowEmptyArchive: true
            cleanWs()
        }
        success {
            echo "All tests passed. Build: ${env.BUILD_URL}"
        }
        failure {
            echo "Tests failed. Report: ${env.BUILD_URL}Playwright_20Local_20Report/"
        }
    }
}

