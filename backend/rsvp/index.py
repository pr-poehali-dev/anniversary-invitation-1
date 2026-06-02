import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Принимает RSVP-ответ от гостя и отправляет письмо на 442843@gmail.com"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '')
    attend = body.get('attend', '')
    drinks = body.get('drinks', [])
    dish = body.get('dish', '')

    attend_text = 'Да, буду' if attend == 'yes' else 'Не смогу'
    dish_text = {'meat': 'Мясо', 'fish': 'Рыба'}.get(dish, '—')
    drinks_text = ', '.join(drinks) if drinks else '—'

    subject = f'RSVP: {name} — {"придёт" if attend == "yes" else "не придёт"}'

    html = f"""
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #0f0f0f; color: #d4d4d4; padding: 40px;">
      <p style="font-size: 11px; letter-spacing: 5px; color: #777; text-transform: uppercase; margin-bottom: 24px;">Новый ответ · Годовщина Егора и Дианы</p>
      <h2 style="font-size: 32px; font-weight: 300; color: #e8e8e8; margin: 0 0 32px;">{name}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Присутствие</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #e8e8e8; font-size: 16px; text-align: right;">{attend_text}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Блюдо</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #e8e8e8; font-size: 16px; text-align: right;">{dish_text}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Напитки</td>
          <td style="padding: 12px 0; color: #e8e8e8; font-size: 16px; text-align: right;">{drinks_text}</td>
        </tr>
      </table>
      <p style="margin-top: 40px; font-size: 10px; color: #444; letter-spacing: 3px; text-transform: uppercase;">26 сентября 2026 · Премьер холл</p>
    </div>
    """

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = '442843@gmail.com'
    msg['To'] = '442843@gmail.com'
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    smtp_password = os.environ.get('SMTP_PASSWORD', '')

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login('442843@gmail.com', smtp_password)
            server.sendmail('442843@gmail.com', '442843@gmail.com', msg.as_string())
        print(f'[RSVP] Email sent for: {name}')
    except Exception as e:
        print(f'[RSVP] Email error: {e}')
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': False, 'error': str(e)})
        }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }