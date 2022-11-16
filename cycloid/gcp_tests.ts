import { BillingExportTable,  GCP_CLOUD_CONSTANTS } from "../packages/gcp"
import BillingExportRow from "../packages/gcp/src/lib/BillingExportRow"
import * as bigquery_fixtures from  "../packages/gcp/src/__tests__/fixtures/bigQuery.fixtures"

import {
  ComputeEstimator,
  EmbodiedEmissionsEstimator,
  MemoryEstimator,
  NetworkingEstimator,
  StorageEstimator,
  UnknownEstimator,
} from '../packages/core'

const {writeFileSync} = require("fs")

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

const testCases: any[] = []

for (const [category_name, category_entries] of Object.entries(bigquery_fixtures)) {
  for (const group of category_entries) {
    for (let i=0; i<group.length; i++) {
      const record = new BillingExportRow(group[i])
      const entry = {
        "name": `${category_name}:${i}`,
        bigquery_row: group[i],
        record: record,
        estimate: service.getFootprintEstimateFromUsageRow(record, []) || {}
      }
    // const groupResults = service(group)
    // for (let i=0; i<group.length; i++) {
    //   const entry = {
    //     "name": `${category_name}:${i}`,
    //     bigquery_row: group[i],
    //     record: new BillingExportRow(group[i]),
    //     estimate: groupResults[i] || {}
    //   }

      testCases.push(entry)
    }
  }
}

// const output = JSON.stringify(testCases)
// writeFileSync("cycloid/out/gcp_testcases.json", output)


// NODE_OPTIONS="--no-warnings" npx ts-node -T cycloid/gcp_tests.ts 