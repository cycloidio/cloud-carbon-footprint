import { BillingExportTable,  GCP_CLOUD_CONSTANTS } from "../packages/gcp"
import BillingExportRow from "../packages/gcp/src/lib/BillingExportRow"
import * as bigquery_fixtures from  "../packages/gcp/src/__tests__/fixtures/bigQuery.fixtures"

import {
  ComputeEstimator,
  COMPUTE_PROCESSOR_TYPES,
  EmbodiedEmissionsEstimator,
  MemoryEstimator,
  NetworkingEstimator,
  StorageEstimator,
  UnknownEstimator,
} from '../packages/core'

const service = new BillingExportTable(
  new ComputeEstimator(),
  new StorageEstimator(GCP_CLOUD_CONSTANTS.SSDCOEFFICIENT),
  new StorageEstimator(GCP_CLOUD_CONSTANTS.HDDCOEFFICIENT),
  new NetworkingEstimator(GCP_CLOUD_CONSTANTS.NETWORKING_COEFFICIENT),
  new MemoryEstimator(GCP_CLOUD_CONSTANTS.MEMORY_COEFFICIENT),
  new UnknownEstimator(GCP_CLOUD_CONSTANTS.ESTIMATE_UNKNOWN_USAGE_BY),
  new EmbodiedEmissionsEstimator(
    GCP_CLOUD_CONSTANTS.SERVER_EXPECTED_LIFESPAN,
  ),
  null,
)

import _ from "lodash"

function generateProcessorTests(processors: string[], numTests: number, maxProcessorsPerTest: number) {
  const tests: any = []

  for (let i=0; i<numTests; i++) {
    const n = Math.floor(Math.random()*maxProcessorsPerTest + 1)
    const input = _.sampleSize(processors, n)
    tests.push({
      processors: input,
      minWatts: GCP_CLOUD_CONSTANTS.getMinWatts(input),
      maxWatts: GCP_CLOUD_CONSTANTS.getMaxWatts(input),
    })
  }

  return tests
}

function generateFixtures() {
  const fixtures: any = []

  for (const [category_name, category_entries] of Object.entries(bigquery_fixtures)) {
    for (const group of category_entries) {
      for (let i=0; i<group.length; i++) {
        const record = new BillingExportRow(group[i])
        fixtures.push({
          name: `${category_name}:${i}`,
          row: group[i],
          record: record,
          ...service.getCycloidTestData(record)
        })
      }
    }
  }

  return fixtures
}

const testCases = {
  fixtures: generateFixtures(),
  processor_tests: [
    // Include all available processors to test fallback behavior
    ...generateProcessorTests(Object.values(COMPUTE_PROCESSOR_TYPES), 1000, 5),
    // Include only "known" processors, to test normal behavior
    ...generateProcessorTests(Object.keys(GCP_CLOUD_CONSTANTS.MAX_WATTS_BY_COMPUTE_PROCESSOR), 1000, 10),
  ]
}

export default testCases

if (require.main == module) {
  console.log(JSON.stringify(testCases))
}

// NODE_OPTIONS="--no-warnings" npx ts-node -T cycloid/gcp_tests.ts 