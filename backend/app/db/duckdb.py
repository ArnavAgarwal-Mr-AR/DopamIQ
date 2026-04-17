import duckdb
import os


DUCKDB_PATH = os.getenv("DUCKDB_PATH", "data/analytics.duckdb")


class DuckDBClient:
    def __init__(self, db_path: str = DUCKDB_PATH):
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        self.conn = duckdb.connect(db_path)

    def execute(self, query: str, params=None):
        if params:
            return self.conn.execute(query, params)
        return self.conn.execute(query)

    def fetch_df(self, query: str):
        return self.conn.execute(query).fetchdf()

    def close(self):
        self.conn.close()


# Singleton
duckdb_client = DuckDBClient()