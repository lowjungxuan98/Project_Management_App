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
      url: "https://i3p592k4x2.execute-api.ap-southeast-1.amazonaws.com/{basePath}",
      variables: {
        basePath: {
          default: "prod"
        }
      }
    }
  ],
  paths: {
    "/{proxy+}": {
      options: {
        parameters: [
          {
            name: "proxy",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "200 response",
            headers: {
              "Access-Control-Allow-Origin": {
                schema: {
                  type: "string"
                }
              },
              "Access-Control-Allow-Methods": {
                schema: {
                  type: "string"
                }
              },
              "Access-Control-Allow-Headers": {
                schema: {
                  type: "string"
                }
              }
            },
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Empty"
                }
              }
            }
          }
        },
        "x-amazon-apigateway-integration": {
          responses: {
            default: {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                "method.response.header.Access-Control-Allow-Origin": "'*'"
              }
            }
          },
          requestTemplates: {
            "application/json": "{\"statusCode\": 200}"
          },
          passthroughBehavior: "when_no_match",
          type: "mock"
        }
      },
      "x-amazon-apigateway-any-method": {
        parameters: [
          {
            name: "proxy",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "200 response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Empty"
                }
              }
            }
          }
        },
        "x-amazon-apigateway-integration": {
          httpMethod: "ANY",
          uri: "http://18.141.160.220/{proxy}",
          responses: {
            default: {
              statusCode: "200"
            }
          },
          requestParameters: {
            "integration.request.path.proxy": "method.request.path.proxy"
          },
          passthroughBehavior: "when_no_match",
          cacheNamespace: "mbcs5j",
          cacheKeyParameters: ["method.request.path.proxy"],
          type: "http_proxy"
        }
      }
    }
  },
  components: {
    schemas: {
      Empty: {
        title: "Empty Schema",
        type: "object"
      }
    },
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