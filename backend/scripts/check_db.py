import psycopg2
from app.config.settings import settings
conn = psycopg2.connect(settings.POSTGRES_URL)
cur = conn.cursor()
try:
    cur.execute("SELECT COUNT(1) FROM features;")
    print('Features count:', cur.fetchone()[0])
except Exception as e:
    print('Features table error:', e)
    conn.rollback()

try:
    cur.execute("SELECT COUNT(1) FROM events;")
    print('Events count:', cur.fetchone()[0])
except Exception as e:
    print('Events table error:', e)
    conn.rollback()
