package org.josh.backend.security;

import org.josh.backend.utils.IdService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class MongoUserDetailsService implements UserDetailsService{

    private final MongoUserRepository mongoUserRepository;

    private final IdService idService = new IdService();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        MongoUser mongoUser = mongoUserRepository.findByUsername(username).orElseThrow(() ->
            new UsernameNotFoundException("Username" + username + "not found"));

        return new User(mongoUser.name(), mongoUser.password(), Collections.emptyList());
    }

    public void registerNewUser(UserWithoutId userWithoutId) {
        PasswordEncoder encoder = new Argon2PasswordEncoder(16, 32, 8, 1 << 16, 4);
        String encodedPassword = encoder.encode(userWithoutId.password());

        MongoUser newUser = new MongoUser(idService.createId() ,userWithoutId.name(), encodedPassword);
        mongoUserRepository.save(newUser);
    }
}
