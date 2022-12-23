import {
    ComputeEstimator,
    COMPUTE_PROCESSOR_TYPES,
    EmbodiedEmissionsEstimator,
    MemoryEstimator,
    NetworkingEstimator,
    StorageEstimator,
    UnknownEstimator,
} from '../packages/core'

import { ConsumptionManagementService, AZURE_CLOUD_CONSTANTS } from '../packages/azure'
import ConsumptionDetailRow from "../packages/azure/src/lib/ConsumptionDetailRow"
import * as azure_fixtures from "../packages/azure/src/__tests__/fixtures/consumptionManagement.fixtures"

import _ from "lodash"

const service = new ConsumptionManagementService(
    new ComputeEstimator(),
    new StorageEstimator(AZURE_CLOUD_CONSTANTS.SSDCOEFFICIENT),
    new StorageEstimator(AZURE_CLOUD_CONSTANTS.HDDCOEFFICIENT),
    new NetworkingEstimator(AZURE_CLOUD_CONSTANTS.NETWORKING_COEFFICIENT),
    new MemoryEstimator(AZURE_CLOUD_CONSTANTS.MEMORY_COEFFICIENT),
    new UnknownEstimator(AZURE_CLOUD_CONSTANTS.ESTIMATE_UNKNOWN_USAGE_BY),
    new EmbodiedEmissionsEstimator(
        AZURE_CLOUD_CONSTANTS.SERVER_EXPECTED_LIFESPAN,
    ),
    null,
)

function generateProcessorTests(processors: string[], numTests: number, maxProcessorsPerTest: number) {
    const tests: any = []

    for (let i = 0; i < numTests; i++) {
        const n = Math.floor(Math.random() * maxProcessorsPerTest + 1)
        const input = _.sampleSize(processors, n)
        tests.push({
            processors: input,
            minWatts: AZURE_CLOUD_CONSTANTS.getMinWatts(input),
            maxWatts: AZURE_CLOUD_CONSTANTS.getMaxWatts(input),
        })
    }

    return tests
}

function generateFixtures() {
    const fixtures: any[] = []

    for (const [category_name, category_entries] of Object.entries(azure_fixtures)) {
        for (let i = 0; i < category_entries.length; i++) {
            const row = category_entries[i]
            const record = new ConsumptionDetailRow(row as any)
            fixtures.push({
                name: `${category_name}:${i}`,
                row,
                record,
                ...service.getCycloidTestData(record),
            })
        }
    }
    return fixtures
}


const output = {
    fixtures: generateFixtures(),
    processorsTests: [
         // Include all available processors to test fallback behavior
    ...generateProcessorTests(Object.values(COMPUTE_PROCESSOR_TYPES), 1000, 5),
    // Include only "known" processors, to test normal behavior
    ...generateProcessorTests(Object.keys(AZURE_CLOUD_CONSTANTS.MAX_WATTS_BY_COMPUTE_PROCESSOR), 1000, 10),
    ]
}
export default output

if (require.main == module) {
    console.log(JSON.stringify(output, null, 2))
}