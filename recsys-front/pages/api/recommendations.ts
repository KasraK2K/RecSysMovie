// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import "@tensorflow/tfjs-node";
import use from "@tensorflow-models/universal-sentence-encoder";
import { searchInPg } from "../../common/helpers/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(404).end("404");
  }

  use
    .load({
      modelUrl: "http://localhost:8080/universal-sentence-encoder/model.json",
    })
    .then(async (model) => {
      const embeddingsRequest = await model.embed(req.body.search);
      const embeddings = embeddingsRequest.arraySync()[0];
      const searchResults = await searchInPg(embeddings, 5);
      return res.status(200).json(searchResults);
    });
}
