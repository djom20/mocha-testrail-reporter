"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
chai.should();
var shared_1 = require("../lib/shared");
describe("Shared functions", function () {
    describe("titleToCaseIds", function () {
        it("Single test case id present", function () {
            var caseIds = shared_1.titleToCaseIds("C123 Test title");
            caseIds.length.should.be.equals(1);
            caseIds[0].should.be.equals(123);
            caseIds = shared_1.titleToCaseIds("Execution of C123 Test title");
            caseIds.length.should.be.equals(1);
            caseIds[0].should.be.equals(123);
        });
        it("Multiple test case ids present", function () {
            var caseIds = shared_1.titleToCaseIds("Execution C321 C123 Test title");
            caseIds.length.should.be.equals(2);
            caseIds[0].should.be.equals(321);
            caseIds[1].should.be.equals(123);
        });
        it("No test case ids present", function () {
            var caseIds = shared_1.titleToCaseIds("Execution Test title");
            caseIds.length.should.be.equals(0);
        });
    });
    describe("Misc tests", function () {
        it("String join", function () {
            var out = [];
            out.push("Test 1: fail");
            out.push("Test 2: pass");
            out.join('\n').should.be.equals("Test 1: fail\nTest 2: pass");
        });
    });
});
//# sourceMappingURL=shared.js.map