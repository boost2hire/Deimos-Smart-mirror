import secrets
import string

def generate_code():
    return "".join(
        secrets.choice(string.ascii_uppercase + string.digits)
        for _ in range(6)
    )
