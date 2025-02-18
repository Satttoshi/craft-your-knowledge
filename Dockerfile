FROM openjdk:20

ENV ENVIRONMENT=prod

LABEL maintainer="joshua stolle github@Satttoshi"

WORKDIR /app

# Create a directory for the app
WORKDIR /app

# Copy the frontend build files
COPY frontend/dist/ /app/src/main/resources/static/

# Copy the backend jar
COPY backend/target/craft-your-knowledge.jar /app/craft-your-knowledge.jar

EXPOSE 8080

CMD [ "sh", "-c", "java -jar app/craft-your-knowledge.jar" ]
