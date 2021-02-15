/*
 * © 2020 ThoughtWorks, Inc. All rights reserved.
 */

import FootprintEstimate from './FootprintEstimate'
import IFootprintEstimator from './IFootprintEstimator'
import StorageUsage from './StorageUsage'
import { CLOUD_PROVIDER_WATT_HOURS_CARBON_RATIOS, CLOUD_CONSTANTS } from './FootprintEstimationConstants'

export class StorageEstimator implements IFootprintEstimator {
  coefficient: number

  constructor(coefficient: number) {
    this.coefficient = coefficient
  }

  estimate(data: StorageUsage[], region: string, cloudProvider: string): FootprintEstimate[] {
    return data.map((d: StorageUsage) => {
      const estimatedWattHours = this.estimateWattHours(d.sizeGb, cloudProvider, region)

      return {
        timestamp: d.timestamp,
        wattHours: estimatedWattHours,
        co2e: this.estimateCo2(estimatedWattHours, region, cloudProvider),
      }
    })
  }

  private estimateWattHours(usageGb: number, cloudProvider: string, region: string) {
    // This function does the following:
    // 1. Convert the used gigabytes to terabytes
    // 2. Multiplies this by the SSD or HDD co-efficient
    // 3. Multiplies this to get the watt-hours in a single day.
    // 4. Multiples this by PUE to account for extra power used by data center (lights, infrastructure, etc.)
    return (usageGb / 1000) * this.coefficient * 24 * CLOUD_CONSTANTS[cloudProvider].getPUE(region)
  }

  private estimateCo2(estimatedWattHours: number, region: string, cloudProvider: string) {
    // This function multiplies the estimated watt-hours by the average CO2e emissions (Kgs) in the region being estimated,
    // as provided by IEA and other energy reports
    return estimatedWattHours * CLOUD_PROVIDER_WATT_HOURS_CARBON_RATIOS[cloudProvider][region]
  }
}
