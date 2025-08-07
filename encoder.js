require("dotenv").config({ quiet: true });

require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");
const moviePlots = require("./dataset/movie-plots.json");
const { storeInPg } = require("./database");

use
  .load({
    modelUrl: "http://localhost:8080/universal-sentence-encoder/model.json",
  })
  .then(async (model) => {
    const batchSize = 1000;

    for (let start = 0; start < moviePlots.length; start += batchSize) {
      const end = Math.min(start + batchSize, moviePlots.length);

      console.log(`Proccessing items from ${start} till ${end}`);

      const movieBatch = moviePlots.slice(start, end);
      const plotDescriptions = movieBatch.map((movie) => movie["Plot"]);

      const embeddingsRequest = await model.embed(plotDescriptions);
      const embeddings = embeddingsRequest.arraySync();

      for (let i = 0; i < movieBatch.length; i++) {
        movieBatch[i]["Embedding"] = embeddings[i];
      }
      await storeInPg(movieBatch);
    }
  });
