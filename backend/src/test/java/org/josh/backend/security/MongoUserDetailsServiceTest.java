package org.josh.backend.security;


import org.josh.backend.utils.IdService;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class MongoUserDetailsServiceTest {

    MongoUserRepository mongoUserRepository = mock(MongoUserRepository.class);
    IdService idService = mock(IdService.class);
    PasswordEncoder encoder = mock(PasswordEncoder.class);

    MongoUserDetailsService mongoUserDetailsService = new MongoUserDetailsService(
        mongoUserRepository,
        idService,
        encoder
    );

    MongoUser testUser = new MongoUser("fakeUserId69", "fakeUserName69", "fakePassword69");

    @Test
    void test_getUserIdByUsername() {
        //given
        String username = "fakeUserName69";
        //when
        when(mongoUserRepository.findByUsername(any()))
            .thenReturn(Optional.of(testUser));
        String userId = mongoUserDetailsService.getUserIdByUsername(username);
        //then
        assertEquals("fakeUserId69", userId);
    }
}
