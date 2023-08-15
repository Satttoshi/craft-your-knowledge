package org.josh.backend.security;

import org.josh.backend.dto.UserWithoutId;
import org.josh.backend.utils.IdService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class MongoUserDetailsService implements UserDetailsService{

    private final MongoUserRepository mongoUserRepository;
    private final IdService idService;
    private final PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        MongoUser mongoUser = mongoUserRepository.findByUsername(username).orElseThrow(() ->
            new UsernameNotFoundException("Username" + username + "not found"));

        return new User(mongoUser.username(), mongoUser.password(), Collections.emptyList());
    }

    public void registerNewUser(UserWithoutId userWithoutId) {
        String encodedPassword = encoder.encode(userWithoutId.password());
        MongoUser newUser = new MongoUser(idService.createId(), userWithoutId.username(), encodedPassword);
        mongoUserRepository.save(newUser);
    }

}
