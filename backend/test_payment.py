from app.services.payment_allocation import allocate_payment


result = allocate_payment(
    50000,
    5000,
    10000,
    100000
)


print(result)
