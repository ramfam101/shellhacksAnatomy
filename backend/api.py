import requests
from requests.adapters import HTTPAdapter
from requests.utils import to_native_string
from base64 import b64encode
import json


# Configuration
APP_CONFIG = {
    'OAUTH_TOKEN_URL': "https://apis.biodigital.com/oauth2/v2/token/",
    'CONTENTAPI_COLLECTIONS_URL': "https://apis.biodigital.com/services/v2/content/collections/",
    "CLIENT_ID": "df7901dcde81e0e21d71554cb1f316eb19501b42",      
    "CLIENT_SECRET": "d0915858a453e0768716078df568f466d3e058db", 
    'GRANT_TYPE': "client_credentials",
    'SCOPE': "contentapi"
}

def get_access_token():
    """
    Obtains an access token using client credentials.
    """
    # Prepare POST data
    post_data = {
        "grant_type": APP_CONFIG['GRANT_TYPE'],
        "scope": APP_CONFIG['SCOPE']
    }
    post_data_string = json.dumps(post_data)

    # Construct authentication string
    authstr = to_native_string(
        b64encode(('%s:%s' % (APP_CONFIG['CLIENT_ID'], APP_CONFIG['CLIENT_SECRET'])).encode('utf-8'))
    ).strip()

    # Headers for the token request
    headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Accept": "application/json",
        "Authorization": "Basic " + authstr
    }

    # Make the POST request to get the access token
    s = requests.Session()
    s.mount('https://', HTTPAdapter(max_retries=0))
    r = s.post(APP_CONFIG['OAUTH_TOKEN_URL'], data=post_data_string, headers=headers, verify=True)

    # Check for errors
    if r.status_code != 200:
        raise Exception(f"Failed to obtain access token: {r.status_code} {r.text}")

    # Parse the access token from the response
    result = r.json()
    access_token = result['access_token']
    return access_token

def get_myhuman_data(access_token):
    """
    Fetches data from the /myhuman endpoint using the access token.
    """
    # Construct headers with the access token
    headers = {
        "Accept": "application/json",
        "Authorization": "Bearer " + access_token
    }

    # Build the URL for the /myhuman endpoint
    url = APP_CONFIG['CONTENTAPI_COLLECTIONS_URL'] + 'myhuman'

    # Make the GET request to the /myhuman endpoint
    s = requests.Session()
    s.mount('https://', HTTPAdapter(max_retries=0))
    r = s.get(url, headers=headers, verify=True)

    # Check for errors
    if r.status_code != 200:
        raise Exception(f"Failed to fetch /myhuman data: {r.status_code} {r.text}")

    # Return the raw JSON data
    return r.json()

def parse_response(data):
    parsed_data = []

    # Iterate over each item in 'myhuman' and extract desired fields
    for entry in data['myhuman']:
        content_title = entry.get('content_title', 'N/A')
        content_type = entry.get('content_type', 'N/A')
        content_url = entry.get('content_url', 'N/A')
        is_quiz = entry.get('content_flags', {}).get('is_quiz', False)

        # Append parsed information to list
        parsed_data.append({
            'title': content_title,
            'type': content_type,
            'url': content_url,
            'is_quiz': is_quiz
        })

    # Filter data based on conditions
    filtered_data = {
        'Full Body': [],
        'Male': [],
        'Female': [],
        'Quiz': []
    }

    for item in parsed_data:
        if 'Complete Anatomy' in item['title']:
            filtered_data['Full Body'].append(item)
        elif 'Male' in item['title']:
            filtered_data['Male'].append(item)
        elif 'Female' in item['title']:
            filtered_data['Female'].append(item)
        if item['is_quiz']:
            filtered_data['Quiz'].append(item)

    return filtered_data

def get_urls():
    """
    Main function to fetch data and return parsed results.
    """
    # Get the access token
    access_token = get_access_token()

    # Fetch data from the /myhuman endpoint
    data = get_myhuman_data(access_token)

    # Parse the response data
    parsed_data = parse_response(data)

    return parsed_data

data = get_urls()
print(data)