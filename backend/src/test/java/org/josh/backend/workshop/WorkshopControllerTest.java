package org.josh.backend.workshop;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
class WorkshopControllerTest {

    // Flapdoodle Test-Dependency -> empty MongoDB will be used for testing

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    String testWorkshopWithoutIdAndLikes = """
            {
                "topic": "fizz",
                "subTopic": "buzz",
                "buzzWords": ["foo", "bar"],
                "estimatedTimeToMaster": 30,
                "difficulty": "EASY"
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
                    .content(testWorkshopWithoutIdAndLikes))
            //THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
            .andExpect(MockMvcResultMatchers.jsonPath("$.topic").value("fizz"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.subTopic").value("buzz"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.buzzWords").isArray())
            .andExpect(MockMvcResultMatchers.jsonPath("$.buzzWords[0]").value("foo"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.buzzWords[1]").value("bar"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.likes").value(0))
            .andExpect(MockMvcResultMatchers.jsonPath("$.estimatedTimeToMaster").value(30))
            .andExpect(MockMvcResultMatchers.jsonPath("$.difficulty").value("EASY")

            );
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
                .content(testWorkshopWithoutIdAndLikes));
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/workshop"))
            //THEN
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").exists())
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].topic").value("fizz"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].subTopic").value("buzz"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].buzzWords").isArray())
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].buzzWords[0]").value("foo"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].buzzWords[1]").value("bar"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].likes").value(0))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].estimatedTimeToMaster").value(30))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].difficulty").value("EASY")
            );

    }

    @Test
    @DirtiesContext
    void expectUpdatedWorkshop_whenUpdateWorkshop() throws Exception {
        //GIVEN
        String testPersonalStatus = """
                {
                    "user": {
                        "id": "adminId",
                        "name": "AdminName"
                    },
                    "progressStatus": "NOT_STARTED",
                    "isLiked": true
                }
            """;

        String result = mockMvc.perform(
                MockMvcRequestBuilders.post("/api/workshop")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(testWorkshopWithoutIdAndLikes))
            .andReturn().getResponse().getContentAsString();

        Workshop saveResultWorkshop = objectMapper.readValue(result, Workshop.class);
        String id = saveResultWorkshop.id();
        String expect = """
                {
                    "id": "%s",
                    "author": {
                        "id": "adminId",
                        "name": "AdminName"
                    },
                    "topic": "fizz",
                    "subTopic": "buzz",
                    "buzzWords": ["foo", "bar"],
                    "likes": 0,
                    "estimatedTimeToMaster": 30,
                    "difficulty": "EASY",
                    "personalStatuses": [
                        {
                            "user": {
                                "id": "adminId",
                                "name": "AdminName"
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
}
