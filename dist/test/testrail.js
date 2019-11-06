"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testrail_1 = require("../lib/testrail");
var testrail_interface_1 = require("../lib/testrail.interface");
describe.skip("TestRail API", function () {
    xit("Publish test run", function (done) {
        var testRail = new testrail_1.TestRail({
            domain: process.env.TESTRAILS_HOST,
            username: process.env.TESTRAILS_USERNAME,
            password: process.env.TESTRAILS_PASSWORD,
            projectId: process.env.TESTRAILS_PROJECTID,
            suiteName: process.env.TESTRAILS_UNIT_SUITENAME
        });
        testRail.fetchCases('104', { type_id: [3], priority_id: [4] }, function (cases) {
            console.log(cases);
            var results;
            cases.forEach((function (value) {
                console.log(value.id, value.title);
            }));
        });
        testRail.publish([{
                case_id: 3033,
                status_id: testrail_interface_1.Status.Passed,
                comment: "Passing...."
            }, {
                case_id: 3034,
                status_id: testrail_interface_1.Status.Passed
            }, {
                case_id: 3035,
                status_id: testrail_interface_1.Status.Passed
            }, {
                case_id: 3036,
                status_id: testrail_interface_1.Status.Failed,
                comment: "Failure...."
            }], done);
    });
});
//# sourceMappingURL=testrail.js.map