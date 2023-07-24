FROM openjdk:20

ENV ENVIRONMENT=prod

LABEL maintainer="joshua stolle github@Satttoshi"

ADD backend/target/craft-your-knowledge.jar craft-your-knowledge.jar

EXPOSE 8080

CMD [ "sh", "-c", "java -jar /craft-your-knowledge.jar" ]