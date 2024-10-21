import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v1.0.0",
    title: "Project Management API Doc",
    description: "Implementation of Swagger with TypeScript"
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: ""
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer"
      }
    }
  }
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./src/index.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);