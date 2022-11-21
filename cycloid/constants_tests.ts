import { CloudConstantsByProvider, COMPUTE_PROCESSOR_TYPES } from "../packages/core"

import { AWS_CLOUD_CONSTANTS, AWS_REGIONS } from "../packages/aws"
import { AZURE_CLOUD_CONSTANTS } from "../packages/azure"
import { GCP_CLOUD_CONSTANTS } from "../packages/gcp"
import { GCP_REGIONS } from "../packages/gcp/src/lib/GCPRegions"
import { AZURE_REGIONS } from "../packages/azure/src/lib/AzureRegions"
import _ from  "lodash"

const all_processors = Object.values(COMPUTE_PROCESSOR_TYPES)

const all_regions = [
    ...Object.values(AWS_REGIONS),
    ...Object.values(GCP_REGIONS),
    ...Object.values(AZURE_REGIONS).map(x => x.name)
]

interface TestCasesByProvider {
    name: string,
    constants: CloudConstantsByProvider,
    pue: {[region: string]: number},
    processorTests: {
        processors: string[]
        memory: number
    }[],
}


function generateProcessorTests(constants: CloudConstantsByProvider, numTests: number, maxTestSize: number) {
    const processorTests = [
        {
            processors: [] as string[],
            memory: constants.getMemory ? constants.getMemory([]) : 0
        },
    ]

    for (let i=0; i<numTests; i++) {
        const testSize = Math.floor(Math.random() * maxTestSize + 1)
        const processors = _.sampleSize(all_processors, testSize)
        const memory = constants.getMemory ? constants.getMemory(processors) : 0
        processorTests.push({processors, memory})
    }

    return processorTests
}

function testCasesForConstants(name: string, constants: CloudConstantsByProvider): TestCasesByProvider {
    const tc: TestCasesByProvider = {
        name: name,
        constants: constants,
        pue: Object.fromEntries(all_regions.map(x => [x, constants.getPUE(x)])),
        processorTests: generateProcessorTests(constants, 1000, 4),
    }

    return tc
}

const output = [
    testCasesForConstants("AWS", AWS_CLOUD_CONSTANTS),
    testCasesForConstants("Azure", AZURE_CLOUD_CONSTANTS),
    testCasesForConstants("GCP", GCP_CLOUD_CONSTANTS),
]

export default output

if (require.main == module) {
    console.log(JSON.stringify(output, null, 2))
}