/*
 * Copyright © 2018 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GitHubRepoRef } from "@atomist/automation-client/operations/common/GitHubRepoRef";
import "mocha";
import * as assert from "power-assert";
import { PushTestInvocation } from "../../../../src/common/listener/GoalSetter";
import { ToPublicRepo } from "../../../../src/common/listener/support/pushTests";

describe("pushToPublicRepo", () => {

    it("should work against public repo", async () => {
        const id = new GitHubRepoRef("atomist", "github-sdm");
        const r = await ToPublicRepo.test({id} as any as PushTestInvocation);
        assert(r);
    });

    it("should work against private repo", async () => {
        const id = new GitHubRepoRef("atomisthq", "internal-automation");
        const r = await ToPublicRepo.test({id} as any as PushTestInvocation);
        assert(!r);
    });

});
