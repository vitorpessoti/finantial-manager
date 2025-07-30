import packageJson from '../../package.json' with { type: 'json' };

class StatusService {
    async execute() {
        return {
            projectName: packageJson.name,
            projectVersion: packageJson.version,
            environment: process.env.ENVIRONMENT,
            nodeVersion: process.version,
            isDatabaseAlive: false,
        }
    }
}

export default StatusService;