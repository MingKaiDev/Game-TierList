import json

# Load the service account JSON
with open('firebase-service-account.json', 'r') as f:
    service_account = json.load(f)

# Escape newlines in private key
private_key = service_account['private_key'].replace('\n', '\\n')

# Map keys to environment variables
env_vars = {
    'FIREBASE_PROJECT_ID': service_account['project_id'],
    'FIREBASE_PRIVATE_KEY_ID': service_account['private_key_id'],
    'FIREBASE_PRIVATE_KEY': private_key,
    'FIREBASE_CLIENT_EMAIL': service_account['client_email'],
    'FIREBASE_CLIENT_ID': service_account['client_id'],
    'FIREBASE_CLIENT_CERT_URL': service_account['client_x509_cert_url'],
}

# Write to file
with open('firebase-env-output.txt', 'w') as f:
    for key, value in env_vars.items():
        f.write(f'{key}={value}\n')

print('.env export written to firebase-env-output.txt')
