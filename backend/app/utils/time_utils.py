from datetime import datetime, timezone, timedelta


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def to_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def time_diff_seconds(t1: datetime, t2: datetime) -> float:
    return abs((t2 - t1).total_seconds())


def is_within_gap(t1: datetime, t2: datetime, minutes: int = 30) -> bool:
    return time_diff_seconds(t1, t2) <= minutes * 60


def get_hour(dt: datetime) -> int:
    return dt.hour


def is_late_night(dt: datetime) -> bool:
    return dt.hour >= 23 or dt.hour < 3


def start_of_day(dt: datetime) -> datetime:
    return dt.replace(hour=0, minute=0, second=0, microsecond=0)


def end_of_day(dt: datetime) -> datetime:
    return dt.replace(hour=23, minute=59, second=59, microsecond=999999)