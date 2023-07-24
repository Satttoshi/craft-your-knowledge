package org.josh.backend.workshop;

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

    @Autowired
    MockMvc mockMvc;

    @Test
    @DirtiesContext
    void expectWorkshop_whenCreateWorkshop() throws Exception {

            //GIVEN
            String workshopWithoutIdAndLikes = """
                    {
                        "topic": "fizz",
                        "subTopic": "buzz",
                        "buzzWords": ["foo", "bar"],
                        "estimatedTimeToMaster": 30,
                        "difficulty": "EASY"
                    }
                """;

            //WHEN
            mockMvc.perform(
                MockMvcRequestBuilders.post("/api/workshop")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(workshopWithoutIdAndLikes))
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

}
