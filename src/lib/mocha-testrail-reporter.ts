import {reporters} from 'mocha';
import {TestRail} from "./testrail";
import {titleToCaseIds} from "./shared";
import { Status, TestRailResult, TestRailOptions} from "./testrail.interface";

export class MochaTestRailReporter extends reporters.Spec {
    private results: TestRailResult[] = [];

    constructor(runner: any) {
        super(runner);

        let reporterOptions: TestRailOptions = <TestRailOptions>{
            domain: process.env.TESTRAILS_HOST,
            username: process.env.TESTRAILS_USERNAME,
            password: process.env.TESTRAILS_PASSWORD,
            projectId: process.env.TESTRAILS_PROJECTID,
            suiteName: process.env.TESTRAILS_UNIT_SUITENAME
        }

        this.validate(reporterOptions, 'domain');
        this.validate(reporterOptions, 'username');
        this.validate(reporterOptions, 'password');
        this.validate(reporterOptions, 'projectId');
        this.validate(reporterOptions, 'suiteName');

        runner.on('start', () => {});

        runner.on('suite', (suite) => {});

        runner.on('suite end', () => {});

        runner.on('pending', (test) => {});

        runner.on('pass', (test) => {
            let caseIds = titleToCaseIds(test.title);
            if (caseIds.length > 0) {
                if (test.speed === 'fast') {
                    let results = caseIds.map(caseId => {
                        return {
                            case_id: caseId,
                            status_id: Status.Passed,
                            comment: `Took (${test.duration}ms)`
                        };
                    });
                    this.results.push(...results);
                } else {
                    let results = caseIds.map(caseId => {
                        return {
                            case_id: caseId,
                            status_id: Status.Passed,
                            comment: `Took (${test.duration}ms)`
                        };
                    });
                    this.results.push(...results);
                }
            }
        });

        runner.on('fail', (test) => {
            let caseIds = titleToCaseIds(test.title);
            if (caseIds.length > 0) {
                let results = caseIds.map(caseId => {
                    return {
                        case_id: caseId,
                        status_id: Status.Failed,
                        comment: `${test.err}, took (${test.duration}ms)`
                    };
                });
                this.results.push(...results);
            }
        });

        runner.on('end', () => {
            if (this.results.length == 0) {
                console.warn("No testcases were matched. Ensure that your tests are declared correctly and matches TCxxx");
            }
            new TestRail(reporterOptions).publish(this.results, () => {
                console.log('Finished')
            });
        });
    }

    private validate(options: any, name: string) {
        if (options == null) throw new Error("Missing --reporter-options in mocha.opts");
        if (options[name] == null) throw new Error(`Missing ${name} value. Please update --reporter-options in mocha.opts`);
    }
}