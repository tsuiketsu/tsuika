import { Meilisearch } from "meilisearch";

const apiKey = process.env.MEILI_MASTER_KEY;

const meil = apiKey
  ? new Meilisearch({
      host: process.env.MEILI_HOST,
      apiKey,
    })
  : null;

export default meil;
