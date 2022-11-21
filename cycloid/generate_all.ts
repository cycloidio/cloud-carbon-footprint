const fs = require("fs")
const path = require("path")

const out_folder = "cycloid/out"
const out_map = {
    "constants_tests.json": require("./constants_tests").default,
    "aws_config.json": require("./aws_config").default,
    "azure_config.json": require("./azure_config").default,
    "azure_tests.json": require("./azure_tests").default,
    "gcp_config.json": require("./gcp_config").default,
    "gcp_tests.json": require("./gcp_tests").default,
}

if (!fs.existsSync(out_folder)) {
    fs.mkdirSync(out_folder)
}

for (const [filename, contents] of Object.entries(out_map)) {
    const output = path.join(out_folder, filename)
    fs.writeFileSync(output, JSON.stringify(contents))
    console.log(output)
}
