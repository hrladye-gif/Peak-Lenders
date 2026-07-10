from datetime import date

from app.services.schedule_generator import generate_flat_schedule

schedule = generate_flat_schedule(
    principal=1000000,
    annual_interest_rate=20,
    term_months=12,
    disbursement_date=date.today()
)

for row in schedule:
    print(row)
