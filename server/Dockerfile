FROM python:3.12-slim

WORKDIR /app

RUN pip install --no-cache-dir pipenv


COPY Pipfile Pipfile.lock ./

RUN pip install fpdf2
RUN pipenv install --system --deploy
RUN mkdir -p /app/app/static/uploads
RUN chmod -R 777 /app/app/static/uploads
COPY . .

EXPOSE 5000

CMD ["python", "run.py"]