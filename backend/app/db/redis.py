"""
Redis removed. Caching is now handled by the browser (30-min localStorage TTL).
This file is kept as a no-op stub to avoid import errors.
"""

class _NoOpRedis:
    def get(self, key): return None
    def set(self, key, value, ex=None): pass
    def delete(self, key): pass
    def ping(self): return True

class RedisClient:
    def __init__(self):
        self.client = _NoOpRedis()

    def get(self, key): return None
    def set(self, key, value, ttl=None): pass
    def delete(self, key): pass


redis_client = RedisClient()