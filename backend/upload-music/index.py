import os
import json
import urllib.request
import urllib.parse
import hmac
import hashlib
import datetime


def sign(key, msg):
    return hmac.new(key, msg.encode('utf-8'), hashlib.sha256).digest()


def get_signature_key(key, date_stamp, region, service):
    k_date = sign(('AWS4' + key).encode('utf-8'), date_stamp)
    k_region = sign(k_date, region)
    k_service = sign(k_region, service)
    k_signing = sign(k_service, 'aws4_request')
    return k_signing


def s3_put(access_key, secret_key, bucket, key, data, content_type):
    endpoint = 'bucket.poehali.dev'
    region = 'us-east-1'
    service = 's3'
    now = datetime.datetime.utcnow()
    amz_date = now.strftime('%Y%m%dT%H%M%SZ')
    date_stamp = now.strftime('%Y%m%d')

    content_hash = hashlib.sha256(data).hexdigest()

    canonical_headers = (
        f'content-type:{content_type}\n'
        f'host:{endpoint}\n'
        f'x-amz-content-sha256:{content_hash}\n'
        f'x-amz-date:{amz_date}\n'
    )
    signed_headers = 'content-type;host;x-amz-content-sha256;x-amz-date'

    canonical_uri = f'/{bucket}/{key}'
    canonical_querystring = ''
    canonical_request = '\n'.join([
        'PUT', canonical_uri, canonical_querystring,
        canonical_headers, signed_headers, content_hash
    ])

    credential_scope = f'{date_stamp}/{region}/{service}/aws4_request'
    string_to_sign = '\n'.join([
        'AWS4-HMAC-SHA256', amz_date, credential_scope,
        hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()
    ])

    signing_key = get_signature_key(secret_key, date_stamp, region, service)
    signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()

    authorization = (
        f'AWS4-HMAC-SHA256 Credential={access_key}/{credential_scope}, '
        f'SignedHeaders={signed_headers}, Signature={signature}'
    )

    url = f'https://{endpoint}/{bucket}/{key}'
    req = urllib.request.Request(url, data=data, method='PUT')
    req.add_header('Content-Type', content_type)
    req.add_header('x-amz-date', amz_date)
    req.add_header('x-amz-content-sha256', content_hash)
    req.add_header('Authorization', authorization)

    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.status


def handler(event: dict, context) -> dict:
    """Скачивает романтический трек с Pixabay и кладёт в S3 проекта"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }

    music_url = "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3"

    req = urllib.request.Request(music_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = resp.read()

    access_key = os.environ['AWS_ACCESS_KEY_ID']
    secret_key = os.environ['AWS_SECRET_ACCESS_KEY']

    s3_put(access_key, secret_key, 'files', 'music/wedding.mp3', data, 'audio/mpeg')

    cdn_url = f"https://cdn.poehali.dev/projects/{access_key}/bucket/music/wedding.mp3"

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'url': cdn_url})
    }