-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Example table using pgvector
CREATE TABLE IF NOT EXISTS movie_plots (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR,
    director    VARCHAR,
    "cast"      VARCHAR,
    genre       VARCHAR,
    plot        TEXT,
    "year"      SMALLINT,
    wiki        VARCHAR,
    embedding   vector(512)     -- Assumes pgvector extension is enabled
);

-- Optional: insert sample data
-- INSERT INTO items (embedding, content)
-- VALUES ('[0.1, 0.2, 0.3, ...]', 'Example item');
