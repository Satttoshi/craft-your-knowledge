package org.josh.backend.workshop;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.josh.backend.dto.GptRequest;
import org.josh.backend.dto.GptResponse;
import org.josh.backend.dto.WorkshopUserChallenge;
import org.josh.backend.openai.*;
import org.josh.backend.security.MongoUserDetailsService;
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

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "testUser", password = "secretPass3")
class WorkshopControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    OpenAiService openAiService;

    @MockBean
    PromptBuilder promptBuilder;

    @MockBean
    MongoUserDetailsService mongoUserDetailsService;

    private static final String MODEL = "gpt-4o-mini";
    private static final double TEMPERATURE = 0.7;

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

        GptRequest gptRequest = new GptRequest(
                MODEL,
                List.of(
                        new PromptMessage(
                                "system",
                                "testSystemPrompt"
                        ),
                        new PromptMessage(
                                "user",
                                "testUserPrompt"
                        )
                ),
                TEMPERATURE
        );

        GptResponse.Usage.CompletionTokensDetails tokenDetails =
                new GptResponse.Usage.CompletionTokensDetails(0, 0, 0);

        Mockito.when(openAiService.getResponse(Mockito.any()))
                .thenReturn(new GptResponse(
                        "fakeId69",
                        "chat.completion",
                        42069,
                        MODEL,
                        List.of(new GptResponse.Choices(
                                new PromptMessage(
                                        "assistant",
                                        ">>>PASS<<<You did it!"
                                ),
                                null, // logprobs
                                "stop",
                                0)
                        ),
                        new GptResponse.Usage(
                                42069,
                                42069,
                                42069,
                                tokenDetails)
                ));

        Mockito.when(promptBuilder.buildChallengeRequestWithPreviousData(any(GptResponse.class)))
                .thenReturn(gptRequest);

        Mockito.when(mongoUserDetailsService.getUserIdByUsername(any(String.class)))
                .thenReturn("fakeUserId69");
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
    @DirtiesContext
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

    @Test
    @DirtiesContext
    void expectPersonalStatusUpdate_whenLikeAndUnlikeWorkshop() throws Exception {

        String result = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/workshop")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(testWorkshopFormData))
            .andReturn().getResponse().getContentAsString();

        Workshop saveResultWorkshop = objectMapper.readValue(result, Workshop.class);
        String id = saveResultWorkshop.id();

        mockMvc.perform(MockMvcRequestBuilders.put("/api/workshop/like/%s".formatted(id)))

            //THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.content().json("""
                    {
                        "id": "%s",
                        "author": {
                            "id": "adminId",
                            "username": "AdminName"
                        },
                        "language": "fizz",
                        "topic": "buzz",
                        "buzzWords": ["foo", "bar"],
                        "likes": 1,
                        "personalStatuses": [
                            {
                                "user": {
                                    "id": "fakeUserId69",
                                    "username": "testUser"
                                },
                                "progressStatus": "NOT_STARTED",
                                "isLiked": true
                            }
                        ]
                    }
                """.formatted(id)));

        mockMvc.perform(MockMvcRequestBuilders.put("/api/workshop/like/%s".formatted(id)))
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.content().json("""
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
                                    "id": "fakeUserId69",
                                    "username": "testUser"
                                },
                                "progressStatus": "NOT_STARTED",
                                "isLiked": false
                            }
                        ]
                    }
                """.formatted(id)));
    }

    @Test
    @DirtiesContext
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
    @DirtiesContext
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
    @DirtiesContext
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
