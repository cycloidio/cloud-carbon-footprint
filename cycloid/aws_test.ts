import {
    ComputeEstimator,
    EmbodiedEmissionsEstimator,
    MemoryEstimator,
    NetworkingEstimator,
    StorageEstimator,
    UnknownEstimator,
} from '../packages/core'

import {
    AWS_CLOUD_CONSTANTS,
} from '../packages/aws/src/domain/AwsFootprintEstimationConstants'

import {
    CostAndUsageReports,
} from '../packages/aws/src/lib'

import CostAndUsageReportsRow from '../packages/aws/src/lib/CostAndUsageReportsRow'

import * as athena_fixtures from '../packages/aws/src/__tests__/fixtures/athena.fixtures'

const { writeFileSync } = require("fs")

const service = new CostAndUsageReports(
    new ComputeEstimator(),
    new StorageEstimator(AWS_CLOUD_CONSTANTS.SSDCOEFFICIENT),
    new StorageEstimator(AWS_CLOUD_CONSTANTS.HDDCOEFFICIENT),
    new NetworkingEstimator(AWS_CLOUD_CONSTANTS.NETWORKING_COEFFICIENT),
    new MemoryEstimator(AWS_CLOUD_CONSTANTS.MEMORY_COEFFICIENT),
    new UnknownEstimator(AWS_CLOUD_CONSTANTS.ESTIMATE_UNKNOWN_USAGE_BY),
    new EmbodiedEmissionsEstimator(
        AWS_CLOUD_CONSTANTS.SERVER_EXPECTED_LIFESPAN,
    ),
    null,
)

const testCases: any[] = []

const accounts = { testAccountId: '123456789' }
const unknownRows: CostAndUsageReportsRow[] = []

for (const [category_name, category_entries] of Object.entries(athena_fixtures)) {
    if (!category_name.startsWith('athenaMock')) continue;
    category_entries.ResultSet.Rows.shift()  // remove header
    const rows = category_entries.ResultSet.Rows
    for (let i = 0; i < rows.length; i++) {
        const rowData = rows[i].Data
        const testname = `${category_name}:${i}`

        // TODO debug
        //if (testname != 'athenaMockGetQueryResultsWithRedshiftStorageComputeSavingsPlan:1') continue
        // TODO debug
        //
        const timestamp = new Date(rowData[0].VarCharValue)
        const accountId = rowData[1].VarCharValue
        const accountName = accounts[accountId]?.name || accountId
        const region = rowData[2].VarCharValue
        const serviceName = rowData[3].VarCharValue
        const usageType = rowData[4].VarCharValue
        const usageUnit = rowData[5].VarCharValue

        const vCpus =
            rowData[6].VarCharValue != '' ? parseFloat(rowData[6].VarCharValue) : null

        const usageAmount = parseFloat(rowData[7].VarCharValue)
        const cost = parseFloat(rowData[8].VarCharValue)

        const tags =
            Object.fromEntries([].map((name, i) => [name, rowData[i + 9].VarCharValue]),)

        const costAndUsageReportRow = new CostAndUsageReportsRow(
            timestamp,
            accountId,
            accountName,
            region,
            serviceName,
            usageType,
            usageUnit,
            vCpus,
            usageAmount,
            cost,
            tags,
        )

        const footprintEstimate = service.getFootprintEstimateFromUsageRow(
            costAndUsageReportRow,
            unknownRows,
        ) || { kilowattHours: 0, co2e: 0 }  // if undefined we just have 0

        const testCase = {
            Name: testname,
            Args: {
                ServiceName: serviceName,
                UsageUnit: usageUnit,
                UsageAmount: usageAmount,
                UsageType: usageType,
                Region: region,
                Timestamp: timestamp,
                VCPUs: vCpus,
            },
            Want: {
                KilowattHours: footprintEstimate.kilowattHours,
                CO2e: footprintEstimate.co2e
            }
        }
        testCases.push(testCase)
        //console.log(costAndUsageReportRow)
        //console.log(testCase)
    }
}

const output = JSON.stringify(testCases)
writeFileSync("cycloid/out/aws_testcases.json", output)

//  NODE_OPTIONS="--no-warnings" npx ts-node -T cycloid/aws_test.ts
