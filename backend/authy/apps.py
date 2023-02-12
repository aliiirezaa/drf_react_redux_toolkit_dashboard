from django.apps import AppConfig


class AuthyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authy'
    
    def ready(self):
        from authy import signals 
      
