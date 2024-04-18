const swaggerAutogen = require("swagger-autogen")

const doc = {
    info: {
        title: "Library v2.0",
        description: "Bookmanagement"
    },
    host: "http://localhost:3000"
}

const outFile = "./swagger-out.json"
const routes = ["./app.js"]

swaggerAutogen(outFile, routes, doc)