package org.josh.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
class MongoUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MongoUserRepository mongoUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final String userWithoutIdJson = """
            {
                "username": "testUser",
                "password": "testPassword"
            }
        """;

    @Test
    void getAnonymousUser_whenGetUserName() throws Exception {
        // GIVEN that user is not logged in
        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/me"))
            // THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.content().string("anonymousUser"));
    }

    @Test
    @DirtiesContext
    void expectHeader_whenFetchMe() throws Exception {
        // GIVEN
        mongoUserRepository.save(new MongoUser("testId", "testUser", passwordEncoder.encode("testPassword")));
        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/me")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + getToken()))
            // THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.content().string("testUser"));
    }

    @Test
    @DirtiesContext
    void loginSuccessfully_whenLoggingIn() throws Exception {
        // GIVEN
        mongoUserRepository.save(new MongoUser("testId", "testUser", passwordEncoder.encode("testPassword")));
        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userWithoutIdJson))
            // THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.content().string(org.hamcrest.Matchers.notNullValue(String.class)));
    }

    private String getToken() throws Exception {
        return mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userWithoutIdJson))
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andReturn().getResponse().getContentAsString();
    }

    @Test
    @DirtiesContext
    void expectRegistration_whenRegisterUser() throws Exception {
        //GIVEN
        String testUserWithoutId = """
                {
                    "username": "testUser",
                    "password": "secretPass3"
                }
            """;

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testUserWithoutId))
            //THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.content().string("registered user testUser"));
    }

}
