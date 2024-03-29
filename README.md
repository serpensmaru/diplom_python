# Дипломный проект по профессии «Fullstack-разработчик на Python»

## ☁️ Облачное хранилище My Cloud

Веб-приложение, которое работает как облачное хранилище. Приложение позволяет пользователям отображать, загружать, отправлять, скачивать и переименовывать файлы. Пользователи могут регистрироваться, логиниться в аккаунт, выходить из него. Пользователь имеет доступ только к своему аккаунту и своим файлам. Есть административный интерфейс — администратор может выполнять все вышеупомянутые действия с любыми пользователями или файлами.

## 🛠 Tech stack

Django, React, Redux.  
Полагаю у вас уже стоит Python v.3.10+, NodeJS v.18+, PostgreSQL v.14+.

## 🔮 Локальная установка

- клонируем репозиторий
```
$ git clone https://github.com/lulzseq/netology-cloud-storage.git
$ cd netology-cloud-storage
```
### База данных

- создаем базу данных PostgreSQL
```
$ psql

# CREATE DATABASE django_db;
```
### Бэкенд
- активируем виртуальное окружение
```
$ python -m venv env
$ source ./env/bin/activate
```
Создаем файл `.env`, где указываем параметры подключения к PostgreSQL и Django Secret Key:
```
# Django

DJANGO_SECRET_KEY = '<DJANGO_SECRET_KEY>'

POSTGRES_DB = 'django_db'
POSTGRES_USER = '<логин>'
POSTGRES_PASSWORD = '<пароль>'
POSTGRES_HOST = 'http://<IP сервера>'
POSTGRES_PORT = '5432'

# React

REACT_APP_API_URL = 'http://<IP сервера>'

# Например, при локальном развертывании это будет http://127.0.0.1:8000
```

- запускаем бэкенд
```
(env) $ pip install -r requirements.txt
(env) $ python manage.py makemigrations accounts
(env) $ python manage.py makemigrations storage
(env) $ python manage.py migrate
(env) $ python manage.py runserver
```
Пути для API:

```
POST /register/ создать пользователя
POST /login/ логин пользователя
GET /logout/ логаут пользователя
PATCH /api/users/<id> переименовать пользователя по ID
DELETE /api/users/ удалить пользователя

GET /api/users/ получить всех юзеров (или только запрашивающего пользователя)
GET /api/users/<id> получить конкретного юзера по ID

GET /api/files/ получить все файлы
GET /api/files/<id> получить инфо файла по ID

POST /api/files/ загрузить файл (form-data)
PATCH /api/files/<id> переименовать файл по ID
DELETE /api/files/<id> удалить файл по ID
```
### Фронтенд
- запускаем фронтенд
```
(env) $ yarn
(env) $ yarn start
```

## 🎰 Развертывание на сервере

- коннектимся к серверу
```
$ ssh root@<IP сервера>
```
- создаем юзера, даем ему права и коннектимся с ним
```
$ adduser <unix_username>
$ usermod <unix_username> -aG sudo
$ su - <unix_username>
```
- обновляем пакеты, устанавливаем новые
```
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install python3-venv python3-pip postgresql nginx
```
- проверяем, что Nginx запущен
```
$ sudo systemctl start nginx
$ sudo systemctl status nginx
```
- клонируем репозиторий и заходим в него
```
$ git clone https://github.com/lulzseq/netology-cloud-storage.git
$ cd netology-cloud-storage
```
### База данных
- не забудем установить базу данных, используем пользователя `postgres`
```
$ sudo su postgres
$ psql

# CREATE DATABASE django_db;
# CREATE USER <username> WITH PASSWORD '<passowrd>';
# GRANT ALL PRIVILEGES ON DATABASE django_db TO <username>;
# \q

$ exit
```
### Бэкенд
- создаем файл `.env` для указания переменных
```
# Django

DJANGO_SECRET_KEY = '<DJANGO_SECRET_KEY>'

POSTGRES_DB = 'django_db'
POSTGRES_USER = '<логин>'
POSTGRES_PASSWORD = '<пароль>'
POSTGRES_HOST = 'http://<IP сервера>'
POSTGRES_PORT = '5432'

# React

REACT_APP_API_URL = 'http://<IP сервера>'
```
- создаем и активируем виртуалльное окружение
```
$ python3 -m venv env
$ source ./env/bin/activate
```
- устанавливаем зависимости Python, применяем миграции и запускаем бэкенд
```
(env) $ pip install -r requirements.txt
(env) $ python manage.py makemigrations accounts
(env) $ python manage.py makemigrations storage
(env) $ python manage.py migrate
(env) $ python manage.py runserver 0.0.0.0:8000
```
Сейчас Django проект должен быть доступен по адресу http://<IP сервера>:8000.
- пишем конфиг Gunicorn
```
(env) $ sudo nano /etc/systemd/system/gunicorn.service
```
В файле пишем следующие настройки (вместо `<unix_username>` надо подставить ваше имя юзера):
```
[Unit]
Description=gunicorn.service
After=network.target

[Service]
User=dima
Group=www-data
WorkingDirectory=/home/<unix_username>/netology-cloud-storage
ExecStart=/home/<unix_username>/netology-cloud-storage/env/bin/gunicorn --access-logfile - --workers=3 --bind unix:/home/<unix_username>/netology-cloud-storage/server/gunicorn.sock server.wsgi:application

[Install]
WantedBy=multi-user.target
```
- запускаем Gunicorn
```
(env) $ sudo systemctl start gunicorn
(env) $ sudo systemctl enable gunicorn
```
- пишем конфиг Nginx
```
(env) $ sudo nano /etc/nginx/sites-available/netology-cloud-storage
```
В файле пишем следующие настройки (вместо `<unix_username>` надо подставить ваше имя юзера):
```
server {
	listen 80;
	server_name 82.97.243.191;

	location /static/ {
		root /home/<unix_username>/netology-cloud-storage;
	}
        
        location /static/js/ {
        alias /home/<unix_username>/netology-cloud-storage/build/static/js/;
    }

       location /static/css/ {
        alias /home/<unix_username>/netology-cloud-storage/build/static/css/;
    }

	location ~ ^/(api|login|register|logout|s)/ {
        include proxy_params;
        proxy_pass http://unix:/home/<unix_username>/netology-cloud-storage/server/gunicorn.sock;
    }

	location / {
		root /home/<unix_username>/netology-cloud-storage/build/;
        try_files $uri /index.html;
	}
}
```
- делаем ссылку на него
```
(env) $ sudo ln -s /etc/nginx/sites-available/netology-cloud-storage /etc/nginx/sites-enabled
```
- открываем порты и даем права Nginx
```
(env) $ sudo ufw allow 8000
(env) $ sudo ufw allow 80
(env) $ sudo ufw allow 'Nginx Full'
```
- проверяем, что службы активны
```
(env) $ sudo systemctl status gunicorn
(env) $ sudo systemctl status nginx
```
- перезагружаем службы
```
(env) $ sudo systemctl daemon-reload
(env) $ sudo systemctl restart gunicorn
(env) $ sudo systemctl restart nginx
```
Теперь Django проект должен быть доступен по http://<IP сервера> на обычном порту 80. Если видим ошибку 502, то, возможно, делло в правах и меняем существующего юзера на имя нашего юзера:
```
(env) $ sudo nano /etc/nginx/nginx.conf
```
```
...
...
user <unix_username>
...
...
```
- перезагружаем службы еще раз и Django проект должен быть доступен по http://<IP сервера> на обычном порту 80:
```
(env) $ sudo systemctl daemon-reload
(env) $ sudo systemctl restart gunicorn
(env) $ sudo systemctl restart nginx
```
- выходим из пользователя обратно в `root`
```
(env) $ exit
```
### Фронтенд
- устанавливаем NodeJS v.18+ и свежий Yarn
```
$ curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - 
$ sudo apt-get install -y nodejs

$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
$ sudo apt update && sudo apt install yarn
```
- заходим обратно в нашего юзера
```
$ su - <unix_username>
```
- устанавливаем зависимости и запускаем сборку фронтенда
```
$ yarn
$ yarn build
```
- проверяем Nginx и перезагружаем его
```
$ sudo nginx -t
$ sudo systemctl restart nginx
```
Теперь проект Django + React должен быть полностью доступен по http://<IP сервера> на обычном порту 80.
## 👮‍♀️ License
- [MIT](https://github.com/lulzseq/netology-cloud-storage/blob/master/LICENSE)