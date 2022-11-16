import {AWS_CLOUD_CONSTANTS} from "../packages/aws"
import { AZURE_CLOUD_CONSTANTS } from "../packages/azure"
import { GCP_CLOUD_CONSTANTS } from "../packages/gcp"

import { CloudConstantsByProvider, COMPUTE_PROCESSOR_TYPES } from "../packages/core"

const { writeFileSync } = require("fs")


interface TestCasesByProvider {
    name: string,
    constants: CloudConstantsByProvider,
    results: {
        processors: string[]
        minWatts: number
        maxWatts: number
    }[]
}

// const testCases: TestCase[] = []
const all_processors = Object.values(COMPUTE_PROCESSOR_TYPES)

function testCasesForConstants(name: string, constants: CloudConstantsByProvider, numEntries: number, maxElements: number): TestCasesByProvider {
    const tc: TestCasesByProvider = {
        name: name,
        constants: constants,
        results: [],
    }

    for (let i = 0; i < numEntries; i++) {
        const processors: string[] = []
        const numElements = Math.floor(Math.random() * maxElements + 1)

        for (let j = 0; j < numElements; j++) {
            const index = Math.floor(Math.random() * all_processors.length)
            processors.push(all_processors[index])

            tc.results.push({
                processors: processors,
                minWatts: constants.getMinWatts(processors),
                maxWatts: constants.getMaxWatts(processors),
            })
        }
    }

    return tc
}


const output = [
    testCasesForConstants("AWS", AWS_CLOUD_CONSTANTS, 1000, 10),
    testCasesForConstants("Azure", AZURE_CLOUD_CONSTANTS, 1000, 10),
    testCasesForConstants("GCP", GCP_CLOUD_CONSTANTS, 1000, 10),
]

writeFileSync("cycloid/out/watt_limits_tests.json", JSON.stringify(output))

// NODE_OPTIONS="--no-warnings" npx ts-node -T cycloid/watt_limits.ts 