import request = require("unirest");
import {TestRailOptions, TestRailResult} from "./testrail.interface";

/**
 * TestRail basic API wrapper
 */
export class TestRail {
    private base: String;

    constructor(private options: TestRailOptions) {
        // compute base url
        this.base = `https://${options.domain}/index.php`;
    }

    private _post(api: String, body: any, callback: Function, error?: Function) {
        var req = request("POST", this.base)
            .query(`/api/v2/${api}`)
            .headers({
                "content-type": "application/json"
            })
            .type("json")
            .send(body)
            .auth(this.options.username, this.options.password)
            .end((res) => {
                if (res.error) {
                    console.log("Error: %s", JSON.stringify(res.body));
                    if (error) {
                        error(res.error);
                    } else {
                        throw new Error(res.error);
                    }
                }
                callback(res.body);
            });
    }

    private _get(api: String, callback: Function, error?: Function) {
        var req = request("GET", this.base)
            .query(`/api/v2/${api}`)
            .headers({
                "content-type": "application/json"
            })
            .type("json")
            .auth(this.options.username, this.options.password)
            .end((res) => {
                if (res.error) {
                    console.log("Error: %s", JSON.stringify(res.body));
                    if (error) {
                        error(res.error);
                    } else {
                        throw new Error(res.error);
                    }
                }
                callback(res.body);
            });
    }

    /**
     * Fetchs test cases from projet/suite based on filtering criteria (optional)
     * @param {{[p: string]: number[]}} filters
     * @param {Function} callback
     */
    public fetchCases(filters?: { [key: string]: number[] }, callback?: Function): void {
        let filter = "";
        if(filters) {
            for (var key in filters) {
                if (filters.hasOwnProperty(key)) {
                    filter += "&" + key + "=" + filters[key].join(",");
                }
            }
        }

        this._get(`get_cases/${this.options.projectId}&suite_id=${this.options.suiteId}${filter}`, (body) => {
            if (callback) {
                callback(body);
            }
        });
    }

    /**
     * Publishes results of execution of an automated test run
     * @param {string} name
     * @param {string} description
     * @param {TestRailResult[]} results
     * @param {Function} callback
     */
    public publish(results: TestRailResult[], callback?: Function): void {
        console.log(`Publishing ${results.length} test result(s) to ${this.base}`);

        this._get(`get_plans/${this.options.projectId}&is_completed=0`, (resp) => {
            if (resp.error) throw new Error(resp.error)

            this._get(`get_plan/${resp.body[0].id}&is_completed=0`, (resp) => {
                if (resp.error) throw new Error(resp.error)

                let run = resp.body.entries
                    .filter(e => e.name.includes(this.options.suiteName))
                    .reduce((obj, e) => {
                        return e.runs.filter(r => {
                            if (r.name.includes(this.options.suiteName)) {
                                obj = r
                                return obj
                            }
                        })
                    }, {})

                this._post(`add_results_for_cases/${run[0].id}`, {
                    results: results
                }, (body) => {
                    // execute callback if specified
                    if (callback) {
                        callback();
                    }
                })
            })
        })
    }
}
