package org.josh.backend.utils;

import org.springframework.stereotype.Component;

import java.util.UUID;
@Component
public
class IdService {
    public String createId(){
        return UUID.randomUUID().toString();
    }
}
