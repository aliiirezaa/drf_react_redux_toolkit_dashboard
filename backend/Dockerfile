FROM python:alpine 
ENV DJANGO_SUPERUSE_PASSWORD 249P!j 
ENV PYTHONUNBUFFERED 1 

WORKDIR /backend 
COPY requirement.txt requirement.txt 
RUN pip install --upgrade pip
RUN pip install -r requirement.txt 

CMD python3 manage.py makemigrations --no-input && \
    python3 manage.py migrate --no-input && \ 
    python3 manage.py collectstatic --no-input &&\
    python3 manage.py createsuperuser --user admin --email admin@gmail.com --phone 0911xxxxxxx --no-input \
    gunicorn -b 0.0.0.0:8000 core.wsgi 