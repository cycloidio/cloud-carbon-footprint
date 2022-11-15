import {
    AWS_CLOUD_CONSTANTS,
    AWS_EMISSIONS_FACTORS_METRIC_TON_PER_KWH,
} from "../packages/aws"

import {
    INSTANCE_TYPE_COMPUTE_PROCESSOR_MAPPING,
    BURSTABLE_INSTANCE_BASELINE_UTILIZATION,
    INSTANCE_FAMILY_TO_INSTANCE_TYPE_MAPPING,
    INSTANCE_TYPE_GPU_PROCESSOR_MAPPING,
    RDS_INSTANCE_TYPES,
    GPU_INSTANCES_TYPES,
    EC2_INSTANCE_TYPES,
    REDSHIFT_INSTANCE_TYPES,
    MSK_INSTANCE_TYPES,
    CACHE_NODE_TYPES,
} from "../packages/aws/src/lib/AWSInstanceTypes"

import {
    AWS_MAPPED_REGION_NAMES_TO_CODES,
} from "../packages/aws/src/lib/AWSRegions"

import {
    SSD_SERVICES,
    SSD_USAGE_TYPES,
    HDD_USAGE_TYPES,
    NETWORKING_USAGE_TYPES,
    BYTE_HOURS_USAGE_TYPES,
    UNKNOWN_USAGE_TYPES,
    UNSUPPORTED_USAGE_TYPES,
    LINE_ITEM_TYPES,
    KNOWN_USAGE_UNITS,
    
} from "../packages/aws/src/lib/CostAndUsageTypes"

const {writeFileSync} = require("fs")

const keys = [
    "SSDCOEFFICIENT",
    "HDDCOEFFICIENT",
    "MEMORY_COEFFICIENT",
    "NETWORKING_COEFFICIENT",
    "AVG_CPU_UTILIZATION_2020",
    "SERVER_EXPECTED_LIFESPAN",
    "REPLICATION_FACTORS",

    "MEMORY_AVG",
    "MEMORY_BY_COMPUTE_PROCESSOR",
    "MIN_WATTS_AVG",
    "PUE_AVG",
    "MIN_WATTS_BY_COMPUTE_PROCESSOR",
    "MAX_WATTS_AVG",
    "MAX_WATTS_BY_COMPUTE_PROCESSOR",
]

const giacomoConfig = {
    ...Object.fromEntries(keys.map(key => [key, AWS_CLOUD_CONSTANTS[key]])),
    INSTANCE_TYPE_COMPUTE_PROCESSOR_MAPPING,
    aws_mapped_region_names_to_codes: AWS_MAPPED_REGION_NAMES_TO_CODES,
    EMISSIONS_FACTORS_METRIC_TON_PER_KWH: AWS_EMISSIONS_FACTORS_METRIC_TON_PER_KWH,
    ssd_services: SSD_SERVICES,
    ssd_usage_types: SSD_USAGE_TYPES,
    hdd_usage_types: HDD_USAGE_TYPES,
    networking_usage_types: NETWORKING_USAGE_TYPES,
    byte_hours_usage_types: BYTE_HOURS_USAGE_TYPES,
    unknown_usage_types: UNKNOWN_USAGE_TYPES,
    unsupported_usage_types: UNSUPPORTED_USAGE_TYPES,
    line_item_types: LINE_ITEM_TYPES,
    known_usage_units: KNOWN_USAGE_UNITS,

    msk_instance_types: MSK_INSTANCE_TYPES,
    redshift_instance_types: REDSHIFT_INSTANCE_TYPES,
    ec2_instance_types: EC2_INSTANCE_TYPES,
    gpu_instance_types: GPU_INSTANCES_TYPES,
    burstable_instance_baseline_utilization: BURSTABLE_INSTANCE_BASELINE_UTILIZATION,
    cache_node_types: CACHE_NODE_TYPES,
    instance_family_to_instance_type_mapping: INSTANCE_FAMILY_TO_INSTANCE_TYPE_MAPPING,
    instance_type_gpu_processor_mapping: INSTANCE_TYPE_GPU_PROCESSOR_MAPPING,
    rds_instance_types: RDS_INSTANCE_TYPES,
}

writeFileSync("cycloid/out/aws_config.json", JSON.stringify(giacomoConfig))

// NODE_OPTIONS="--no-warnings" npx ts-node -T cycloid/aws_config.ts  