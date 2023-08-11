package org.josh.backend.workshop;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.josh.backend.dto.Gpt3TurboRequest;
import org.josh.backend.dto.Gpt3TurboResponse;
import org.josh.backend.dto.WorkshopUserChallenge;
import org.josh.backend.openai.*;
import org.josh.backend.security.MongoUserWithoutPassword;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "testUser", password = "secretPass3")
class WorkshopControllerTest {

    // Flapdoodle Test-Dependency -> empty MongoDB will be used for testing

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    OpenAiService openAiService;

    @MockBean
    PromptBuilder promptBuilder;

    @BeforeEach
    void setUp() throws Exception {

        String testUserWithoutId = """
                {
                    "username": "testUser",
                    "password": "secretPass3"
                }
            """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(testUserWithoutId)).andExpect(MockMvcResultMatchers.status().isOk());

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login"))
            .andExpect(MockMvcResultMatchers.status().isOk());

        Gpt3TurboRequest gpt3TurboRequest = new Gpt3TurboRequest(
            "gpt-3.5-turbo",
            List.of(
                new PromptMessage(
                    "system",
                    "testSystemPrompt"
                ),
                new PromptMessage(
                    "user",
                    "testUserPrompt"
                )
            )
        );

        Mockito.when(openAiService.getResponse(Mockito.any()))
            .thenReturn(new Gpt3TurboResponse(
                "fakeId69",
                "chat.completion",
                42069,
                List.of(new Gpt3TurboResponse.Choices(
                    0,
                    new PromptMessage(
                        "assistant",
                        ">>>PASS<<<You did it!"
                    ),
                    "stop")
                ),
                new Gpt3TurboResponse.Usage(
                    42069,
                    42069,
                    42069)

            ));

        Mockito.when(promptBuilder.buildChallengeRequestWithPreviousData(any(Gpt3TurboResponse.class))).thenReturn(gpt3TurboRequest);
    }

    String testWorkshopFormData = """
            {
                "language": "fizz",
                "topic": "buzz",
                "buzzWords": ["foo", "bar"]
            }
        """;

    @Test
    @DirtiesContext
    void expectWorkshop_whenCreateWorkshop() throws Exception {

        //GIVEN
        //WHEN
        mockMvc.perform(
                MockMvcRequestBuilders.post("/api/workshop")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(testWorkshopFormData))
            //THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
            .andExpect(MockMvcResultMatchers.jsonPath("$.language").value("fizz"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.topic").value("buzz"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.buzzWords").isArray())
            .andExpect(MockMvcResultMatchers.jsonPath("$.buzzWords[0]").value("foo"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.buzzWords[1]").value("bar"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.likes").value(0));
    }

    @Test
    @DirtiesContext
    void expectWorkshop_whenGetWorkshopById() throws Exception {
        //GIVEN
        String result = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/workshop")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(testWorkshopFormData))
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andReturn().getResponse().getContentAsString();

        Workshop saveResultWorkshop = objectMapper.readValue(result, Workshop.class);
        String id = saveResultWorkshop.id();

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/workshop/%s".formatted(id)))

            //THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.content().json(result));
    }

    @Test
    void expectEmptyList_whenReadWorkshops() throws Exception {
        //GIVEN
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/workshop"))
            //THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.content().json("[]"));
    }

    @Test
    @DirtiesContext
    void expectWorkshopList_whenReadWorkshops() throws Exception {
        //GIVEN
        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/workshop")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testWorkshopFormData));
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/workshop"))
            //THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").exists())
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].language").value("fizz"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].topic").value("buzz"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].buzzWords").isArray())
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].buzzWords[0]").value("foo"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].buzzWords[1]").value("bar"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].likes").value(0));
    }

    @Test
    @DirtiesContext
    void expectUpdatedWorkshop_whenUpdateWorkshop() throws Exception {
        //GIVEN
        String testPersonalStatus = """
                {
                    "user": {
                        "id": "adminId",
                        "username": "AdminName"
                    },
                    "progressStatus": "NOT_STARTED",
                    "isLiked": true
                }
            """;

        String result = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/workshop")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(testWorkshopFormData))
            .andReturn().getResponse().getContentAsString();

        Workshop saveResultWorkshop = objectMapper.readValue(result, Workshop.class);
        String id = saveResultWorkshop.id();
        String expect = """
                {
                    "id": "%s",
                    "author": {
                        "id": "adminId",
                        "username": "AdminName"
                    },
                    "language": "fizz",
                    "topic": "buzz",
                    "buzzWords": ["foo", "bar"],
                    "likes": 0,
                    "personalStatuses": [
                        {
                            "user": {
                                "id": "adminId",
                                "username": "AdminName"
                            },
                            "progressStatus": "NOT_STARTED",
                            "isLiked": true
                        }
                    ]
                }
            """.formatted(id);

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.put("/api/workshop/%s".formatted(id))
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPersonalStatus))

            //THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.content().json(expect));
    }

    @DirtiesContext
    @Test
    void expectEmptyList_whenDeleteWorkshopById() throws Exception {

        //GIVEN
        String result = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/workshop")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(testWorkshopFormData))
            .andReturn().getResponse().getContentAsString();

        Workshop saveResultWorkshop = objectMapper.readValue(result, Workshop.class);
        String id = saveResultWorkshop.id();

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/workshop/%s".formatted(id)))

            //THEN
            .andExpect(MockMvcResultMatchers.status().isOk());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/workshop"))
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.content().json("[]"));
    }

    @Test
    void expectErrorMessage_whenDeleteWorkshopById() throws Exception {

        //GIVEN
        String id = "fakeId";

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/workshop/%s".formatted(id)))

            //THEN
            .andExpect(MockMvcResultMatchers.status().isNotFound())
            .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("No workshop found with Id: %s".formatted(id)));
    }

    @Test
    void expectValidation_whenValidateChallenge() throws Exception {
        //GIVEN
        String result = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/workshop")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(testWorkshopFormData))
            .andReturn().getResponse().getContentAsString();

        Workshop saveResultWorkshop = objectMapper.readValue(result, Workshop.class);
        String id = saveResultWorkshop.id();

        WorkshopUserChallenge workshopUserChallenge = new WorkshopUserChallenge(
            new MongoUserWithoutPassword("fakeUserId69", "fakeUserName69"),
            "testTopic",
            "testSubTopic",
            "do back flips",
            "i dont do back flips"
        );

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/workshop/%s/validate".formatted(id))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(workshopUserChallenge)))

            //THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("fakeId69"));
    }

}
