# Build frontend
FROM node:18 as frontend-builder
WORKDIR /build/frontend
COPY frontend/ .
RUN npm install && npm run build

# Build backend
FROM maven:3.9-eclipse-temurin-20 as backend-builder
WORKDIR /build/backend
COPY backend/ .
COPY --from=frontend-builder /build/frontend/dist/ src/main/resources/static/
RUN mvn package

# Final stage
FROM openjdk:20
ENV ENVIRONMENT=prod
WORKDIR /app

# Copy built backend (which now includes frontend in static resources)
COPY --from=backend-builder /build/backend/target/craft-your-knowledge.jar /app/craft-your-knowledge.jar

EXPOSE 8080
CMD ["java", "-jar", "/app/craft-your-knowledge.jar"]
