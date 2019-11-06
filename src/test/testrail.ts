import {TestRail} from "../lib/testrail";
import {TestRailResult, TestRailCase, Status} from "../lib/testrail.interface";

describe.skip("TestRail API", () => {
    xit("Publish test run", (done) => {
        let testRail = new TestRail({
            domain: process.env.TESTRAILS_HOST,
            username: process.env.TESTRAILS_USERNAME,
            password: process.env.TESTRAILS_PASSWORD,
            projectId: process.env.TESTRAILS_PROJECTID,
            suiteName: process.env.TESTRAILS_UNIT_SUITENAME
        });

        testRail.fetchCases('104', {type_id: [3], priority_id: [4]}, (cases: TestRailCase[]) => {
            console.log(cases);
            let results: TestRailResult
            cases.forEach((value => {
                console.log(value.id, value.title);
            }));
        });

        testRail.publish([{
            case_id: 3033,
            status_id: Status.Passed,
            comment: "Passing...."
        }, {
            case_id: 3034,
            status_id: Status.Passed
        }, {
            case_id: 3035,
            status_id: Status.Passed
        }, {
            case_id: 3036,
            status_id: Status.Failed,
            comment: "Failure...."
        }], done);
    });
});