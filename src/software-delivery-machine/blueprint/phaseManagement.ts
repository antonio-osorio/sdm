import { GitProject } from "@atomist/automation-client/project/git/GitProject";
import { SetupPhasesOnPush } from "../../handlers/events/delivery/SetupPhasesOnPush";
import { FailDownstreamPhasesOnPhaseFailure } from "../../handlers/events/delivery/FailDownstreamPhasesOnPhaseFailure";
import { HttpServicePhases, LibraryPhases } from "../../handlers/events/delivery/phases/httpServicePhases";
import { Phases } from "../../handlers/events/delivery/Phases";

export const PhaseSetup = new SetupPhasesOnPush(scan);

async function scan(p: GitProject): Promise<Phases> {
    try {
        const f = await p.findFile("pom.xml");
        const manifest = await p.findFile("manifest.yml").catch(err => undefined);
        const contents = await f.getContent();
        if (contents.includes("spring-boot") && !!manifest) {
            return HttpServicePhases;
        } else {
            return LibraryPhases;
        }
    } catch {
        return undefined;
    }
}

export const PhaseCleanup = new FailDownstreamPhasesOnPhaseFailure(HttpServicePhases);
