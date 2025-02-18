FROM openjdk:20 as builder

# Set up Node.js for frontend build
RUN apt-get update && apt-get install -y nodejs npm

# Build frontend
WORKDIR /build/frontend
COPY frontend/ .
RUN npm install && npm run build

# Build backend
WORKDIR /build/backend
COPY backend/ .
RUN ./mvnw package

# Final stage
FROM openjdk:20
ENV ENVIRONMENT=prod
WORKDIR /app

# Copy built frontend and backend
COPY --from=builder /build/frontend/dist/ /app/src/main/resources/static/
COPY --from=builder /build/backend/target/craft-your-knowledge.jar /app/craft-your-knowledge.jar

EXPOSE 8080
CMD ["java", "-jar", "/app/craft-your-knowledge.jar"]