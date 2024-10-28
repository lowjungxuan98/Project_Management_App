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
      description: "Developer API Doc",
    },
    {
      url: "http://18.141.160.220:80",
      description: "Production API Doc",
    },
    {
      url: "https://i3p592k4x2.execute-api.ap-southeast-1.amazonaws.com/prod",
      description: "API Gateway"
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