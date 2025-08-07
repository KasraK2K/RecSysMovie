const pgp = require("pg-promise")({ capSQL: true });

// prettier-ignore
const config = {
  user:     process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host:     process.env.POSTGRES_HOST,
  port:     process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
};

const db = pgp(config);

async function storeInPg(movieBatch) {
  const columns = new pgp.helpers.ColumnSet(
    ["title", "director", "plot", "year", "wiki", "cast", "genre", "embedding"],
    { table: "movie_plots" },
  );

  const values = movieBatch.map((movie) => ({
    title: movie["Title"],
    director: movie["Director"],
    cast: movie["Cast"],
    genre: movie["Genre"],
    plot: movie["Plot"],
    year: movie["Release Year"],
    wiki: movie["Wiki Page"],
    embedding: movie["Embedding"],
  }));

  const query = pgp.helpers.insert(values, columns);

  await db.none(query);
}

module.exports = { db, storeInPg };
