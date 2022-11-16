import {GCP_CLOUD_CONSTANTS, getGCPEmissionsFactors} from "../packages/gcp"

import {
    COMPUTE_STRING_FORMATS,
    MEMORY_USAGE_TYPES,
    NETWORKING_STRING_FORMATS,
    SERVICES_TO_OVERRIDE_USAGE_UNIT_AS_UNKNOWN,
    UNKNOWN_SERVICE_TYPES,
    UNKNOWN_USAGE_TYPES,
    UNKNOWN_USAGE_UNITS,
    UNSUPPORTED_USAGE_TYPES,
}
from "../packages/gcp/src/lib/BillingExportTypes"

import {
    GCP_DUAL_REGIONS,
    GCP_MULTI_REGIONS
} from "../packages/gcp/src/lib/GCPRegions" 

import {
    GPU_MACHINE_TYPES,
    INSTANCE_TYPE_COMPUTE_PROCESSOR_MAPPING,
    MACHINE_FAMILY_SHARED_CORE_TO_MACHINE_TYPE_MAPPING,
    MACHINE_FAMILY_TO_MACHINE_TYPE_MAPPING,
    N1_SHARED_CORE_MACHINE_FAMILY_TO_MACHINE_TYPE_MAPPING,
    SHARED_CORE_PROCESSORS,
} from "../packages/gcp/src/lib/MachineTypes"

const {writeFileSync} = require("fs")

const keys = [
    "SSDCOEFFICIENT",
    "HDDCOEFFICIENT",
    "MEMORY_AVG",
    "MEMORY_BY_COMPUTE_PROCESSOR",
    "MIN_WATTS_MEDIAN",
    "MIN_WATTS_BY_COMPUTE_PROCESSOR",
    "MAX_WATTS_MEDIAN",
    "MAX_WATTS_BY_COMPUTE_PROCESSOR",
    "NETWORKING_COEFFICIENT",
    "MEMORY_COEFFICIENT",
    "PUE_AVG",
    "PUE_TRAILING_TWELVE_MONTH",
    "AVG_CPU_UTILIZATION_2020",
    "REPLICATION_FACTORS",
    "SERVER_EXPECTED_LIFESPAN",
]

const config = {
    constants: {
        INSTANCE_TYPE_COMPUTE_PROCESSOR_MAPPING,
        EMISSIONS_FACTORS_METRIC_TON_PER_KWH: getGCPEmissionsFactors(),
        ...Object.fromEntries(keys.map(key => [key, GCP_CLOUD_CONSTANTS[key]])),
    },
    parameters: {
        VCPUS_PER_GKE_CLUSTER: 3,
        VCPUS_PER_CLOUD_COMPOSER_ENVIRONMENT: 14,
        
        COMPUTE_STRING_FORMATS,
        MEMORY_USAGE_TYPES,
        NETWORKING_STRING_FORMATS,
        UNKNOWN_SERVICE_TYPES,
        UNKNOWN_USAGE_TYPES,
        UNKNOWN_USAGE_UNITS,
        UNSUPPORTED_USAGE_TYPES,
        GPU_MACHINE_TYPES,
        MACHINE_FAMILY_SHARED_CORE_TO_MACHINE_TYPE_MAPPING,
        MACHINE_FAMILY_TO_MACHINE_TYPE_MAPPING,
        N1_SHARED_CORE_MACHINE_FAMILY_TO_MACHINE_TYPE_MAPPING,
        SHARED_CORE_PROCESSORS: Object.values(SHARED_CORE_PROCESSORS),
        DUAL_REGIONS: Object.values(GCP_DUAL_REGIONS),
        MULTI_REGIONS: Object.values(GCP_MULTI_REGIONS),
        SERVICES_TO_OVERRIDE_USAGE_UNIT_AS_UNKNOWN,
    },
}

writeFileSync("cycloid/out/gcp_config.json", JSON.stringify(config))

// NODE_OPTIONS="--no-warnings" npx ts-node -T cycloid/gcp_config.ts