from decouple import config  

from kavenegar import *

def send_otp(receptor, token):
    try:
        API_KEY = config('KavenegarAPI')
        api = KavenegarAPI(API_KEY)
        params = {
            'sender' : '1000596446',
            'receptor': receptor,
            'message':f'کد احراز هویت شا : {token}'
        }   
        response = api.sms_send(params)
        print(f'\n response {response} \n')
    except APIException as e: 
        print(f'\n error 1 {e} \n')
    except HTTPException as e: 
            print(f'\n error 2 {e} \n')