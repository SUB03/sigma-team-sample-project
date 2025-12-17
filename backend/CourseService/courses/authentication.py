"""
Кастомная JWT аутентификация для микросервисов.
Валидирует токен и извлекает user_id без обращения к локальной БД.
"""
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken


class MicroserviceUser:
    """Упрощенный объект пользователя для межсервисного взаимодействия"""
    
    def __init__(self, user_id):
        self.id = user_id
        self.pk = user_id
        self.is_authenticated = True
        self.is_anonymous = False
    
    def __str__(self):
        return f"MicroserviceUser(id={self.id})"
    
    def __repr__(self):
        return self.__str__()


class MicroserviceJWTAuthentication(JWTAuthentication):
    """
    JWT аутентификация для микросервисов.
    Не требует наличия пользователя в локальной БД.
    """
    
    def get_user(self, validated_token):
        """
        Возвращает упрощенный объект пользователя на основе user_id из токена.
        Не обращается к БД.
        """
        try:
            user_id = validated_token.get('user_id')
            
            if user_id is None:
                raise InvalidToken('Token contained no recognizable user identification')
            
            # Возвращаем упрощенный объект пользователя без обращения к БД
            return MicroserviceUser(user_id=user_id)
            
        except KeyError:
            raise InvalidToken('Token contained no recognizable user identification')
