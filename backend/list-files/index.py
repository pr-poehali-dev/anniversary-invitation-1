import os
import json
import urllib.request
import urllib.parse
import hmac
import hashlib
import datetime
import xml.etree.ElementTree as ET


def sign(key, msg):
    return hmac.new(key, msg.encode('utf-8'), hashlib.sha256).digest()


def get_signature_key(key, date_stamp, region, service):
    k_date = sign(('AWS4' + key).encode('utf-8'), date_stamp)
    k_region = sign(k_date, region)
    k_service = sign(k_region, service)
    return sign(k_service, 'aws4_request')


def s3_list(access_key, secret_key, bucket):
    endpoint = 'bucket.poehali.dev'
    region = 'us-east-1'
    service = 's3'
    now = datetime.datetime.utcnow()
    amz_date = now.strftime('%Y%m%dT%H%M%SZ')
    date_stamp = now.strftime('%Y%m%d')

    content_hash = hashlib.sha256(b'').hexdigest()
    canonical_uri = f'/{bucket}'
    canonical_querystring = 'list-type=2'
    canonical_headers = (
        f'host:{endpoint}\n'
        f'x-amz-content-sha256:{content_hash}\n'
        f'x-amz-date:{amz_date}\n'
    )
    signed_headers = 'host;x-amz-content-sha256;x-amz-date'
    canonical_request = '\n'.join([
        'GET', canonical_uri, canonical_querystring,
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

    url = f'https://{endpoint}/{bucket}?list-type=2'
    req = urllib.request.Request(url)
    req.add_header('x-amz-date', amz_date)
    req.add_header('x-amz-content-sha256', content_hash)
    req.add_header('Authorization', authorization)

    with urllib.request.urlopen(req, timeout=15) as resp:
        body = resp.read()

    root = ET.fromstring(body)
    ns = {'s3': 'http://s3.amazonaws.com/doc/2006-03-01/'}
    files = []
    for obj in root.findall('s3:Contents', ns):
        key = obj.find('s3:Key', ns).text
        size = obj.find('s3:Size', ns).text
        files.append({'key': key, 'size': int(size)})
    return files


def handler(event: dict, context) -> dict:
    """Возвращает список файлов в S3 хранилище проекта"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': ''}

    access_key = os.environ['AWS_ACCESS_KEY_ID']
    secret_key = os.environ['AWS_SECRET_ACCESS_KEY']

    files = s3_list(access_key, secret_key, 'files')

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'files': files})
    }
