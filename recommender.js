require("dotenv").config({ quiet: true });

require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");
const { searchInPg } = require("./database");

use
  .load({
    modelUrl: "http://localhost:8080/universal-sentence-encoder/model.json",
  })
  .then(async (model) => {
    const embeddingsRequest = await model.embed("a lot of cute puppies");
    const embeddings = embeddingsRequest.arraySync()[0];
    const searchResults = await searchInPg(embeddings, 5);
    console.log(searchResults);
  });
