from app.services.trend_service import get_behavioral_signals

sigs = get_behavioral_signals("demo_user", view="day")
print("Hour   prob  dur(m)  binge")
for s in sigs:
    bar = "#" * (s["prob"] // 10)
    print(f"  {s['label']}:00  {s['prob']:3d}%  {s['duration']:5.1f}m  {s['binge']}%  {bar}")
