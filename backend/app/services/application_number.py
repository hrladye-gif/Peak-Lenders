from uuid import uuid4


def generate_application_number():
    return f"APP-{uuid4().hex[:8].upper()}"
