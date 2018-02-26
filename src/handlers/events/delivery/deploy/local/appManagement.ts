import { logger } from "@atomist/automation-client";
import { RemoteRepoRef } from "@atomist/automation-client/operations/common/RepoId";
import { ChildProcess } from "child_process";

/**
 * Ports will be reused for the same app
 */
export interface DeployedApp {

    id: RemoteRepoRef;

    port: number;

    /** Will be undefined if the app is not currently deployed */
    childProcess: ChildProcess;
}

/**
 * Manages deployments
 * This is not intended for production use
 * @type {Array}
 */
export class ManagedDeployments {

    private deployments: DeployedApp[] = [];

    constructor(public initialPort: number) {
    }

    /**
     * Find a new port for this app
     * @param {RemoteRepoRef} id
     * @return {number}
     */
    public findPort(id: RemoteRepoRef): number {
        const running = this.deployments
            .find(d => d.id.owner === id.owner && d.id.repo === id.repo);
        return !!running ? running.port : this.nextFreePort();
    }

    public async recordDeployment(da: DeployedApp) {
        logger.info("Recording app [%j] on port [%d]", da.port);
        // Undeploy it if necessary
        await this.undeploy(da.id);
        this.deployments.push(da);
    }

    public async undeploy(id: RemoteRepoRef): Promise<any> {
        const victim = this.deployments.find(d => d.id.sha === id.sha);
        if (!!victim) {
            victim.childProcess.kill();
            // Keep the port but deallocate the process
            victim.childProcess = undefined;
            logger.info("Killed app [%j], but continuing to reserve port [%d]", victim.port);
        }
    }

    private nextFreePort(): number {
        let port = this.initialPort;
        while (this.deployments.some(d => d.port === port)) {
            port++;
        }
        return port;
    }

}
