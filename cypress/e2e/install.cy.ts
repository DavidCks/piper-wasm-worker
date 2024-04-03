// Assuming install function is accessible globally or within the test context

import { install } from "../..";
describe("install function integration test", () => {
  it("should successfully download and return model and config objects", () => {
    // Define URLs
    const modelUrl =
      "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_GB/alba/medium/en_GB-alba-medium.onnx";
    const configUrl =
      "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_GB/alba/medium/en_GB-alba-medium.onnx.json";

    // Prepare to capture progress updates
    const progressUpdates: number[] = [];
    const onProgress = (percent: number) => {
      progressUpdates.push(percent);
    };

    Cypress.config("defaultCommandTimeout", 60000);
    // Wrap the install function to use it in Cypress chain
    cy.wrap(null).then(() => {
      // Here we call the actual install function
      return install(modelUrl, configUrl, onProgress).then((result) => {
        checkIsBlob(result.model);
        expect(result.modelConfig).to.be.an("object");

        // Validate progress updates if applicable
        expect(progressUpdates).to.not.have.length(0);
      });
    });
  });
});

function checkIsBlob(obj: any) {
  expect(obj).to.have.property("size").and.to.be.a("number");
  expect(obj).to.have.property("type").and.to.be.a("string");
  expect(obj).to.have.property("arrayBuffer").and.to.be.a("function");
  expect(obj).to.have.property("slice").and.to.be.a("function");
  expect(obj).to.have.property("text").and.to.be.a("function");
  expect(obj).to.have.property("stream").and.to.be.a("function");
}
