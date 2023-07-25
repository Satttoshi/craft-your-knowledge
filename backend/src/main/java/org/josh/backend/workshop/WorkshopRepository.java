package org.josh.backend.workshop;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkshopRepository extends MongoRepository<Workshop, String> {
}
