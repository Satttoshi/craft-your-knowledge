package org.josh.backend;

import org.josh.backend.workshop.WorkshopService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private WorkshopService workshopService;
	@Test
	void contextLoads() {
		Assertions.assertNotNull(workshopService);
	}

}
