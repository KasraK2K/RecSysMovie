const fs = require("fs");
const path = require("path");

// prettier-ignore
if (!fs.existsSync(modelsPath)) {
  fs.mkdirSync(path.resolve(__dirname, modelsPath), { recursive: true });

  fetch(
    "https://storage.googleapis.com/tfjs-models/savedmodel/universal_sentence_encoder/model.json",
  )
    .then((response) => response.json())
    .then((result) => {
      const modelsPath = path.resolve(__dirname, "./models/universal-sentence-encoder");
      const modelPath = path.resolve(modelsPath, "model.json");
      const binPaths = result.weightsManifest[0].paths;

      // Create model.json
      fs.writeFileSync(modelPath, JSON.stringify(result));

      // Create binary files
      for (const binPath of binPaths) {
        const url = `https://storage.googleapis.com/tfjs-models/savedmodel/universal_sentence_encoder/${binPath}`;
        fetch(url)
          .then((response) => response.arrayBuffer())
          .then((data) => {
            const binPathWithoutExt = binPath.replace(".bin", "");
            const binFilePath = path.resolve(modelsPath, binPathWithoutExt);
            fs.writeFileSync(binFilePath, Buffer.from(data));
          })
          .catch((error) => {
            console.log(`Error fetching ${binPath}: ${error.message}`);
          });
      }

    })
    .catch((error) => {
      console.log(error.message);
    });
}
