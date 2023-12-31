package org.josh.backend;

import org.josh.backend.security.JwtFilter;
import org.josh.backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.servlet.config.annotation.ResourceChainRegistration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@WebMvcTest({Config.class})
@AutoConfigureMockMvc
@WithMockUser(username = "testUser", password = "secretPass3")
@Import(JwtFilter.class)
class ConfigTest {

    @Autowired
    private MockMvc mockMvc;

    private Config config;

    @SuppressWarnings("unused")
    @MockBean
    private JwtService jwtService;

    @Mock
    private ResourceHandlerRegistry registry = mock(ResourceHandlerRegistry.class);

    @BeforeEach
    public void setUp() {
        config = new Config();
    }

    @Test
    void expectResourceHandlerInRegistry_whenHandlerIsAdded() {
        //GIVEN
        ResourceHandlerRegistration registration = mock(ResourceHandlerRegistration.class);
        ResourceChainRegistration chainRegistration = mock(ResourceChainRegistration.class);
        //WHEN
        when(registry.addResourceHandler(any(String.class))).thenReturn(registration);
        when(registration.addResourceLocations(any(String[].class))).thenReturn(registration);
        when(registration.resourceChain(any(Boolean.class))).thenReturn(chainRegistration);
        when(chainRegistration.addResolver(any(PathResourceResolver.class))).thenReturn(chainRegistration);
        config.addResourceHandlers(registry);
        //THEN
        verify(registry).addResourceHandler("/**");
        verify(registration).addResourceLocations("classpath:/static/");
        verify(registration).resourceChain(true);
        verify(chainRegistration).addResolver(any(PathResourceResolver.class));
    }

    @Test
    void expectExistingResource() throws IOException {
        //GIVEN;
        Resource location = new ClassPathResource("/static/");
        String resourcePath = "existing-resource.csv";
        //WHEN
        Resource result = new PathResourceResolver() {
            public Resource callGetResource(String resourcePath, Resource location) throws IOException {
                return getResource(resourcePath, location);
            }
        }.callGetResource(resourcePath, location);
        //THEN
        assertEquals(result, location.createRelative(resourcePath));
    }

    @Test
    void expectExistingResource_whenRequestingExistingResource() throws Exception {
        //GIVEN
        String resourcePath = "/existing-resource.csv";
        String expected = "This is a test";
        //WHEN
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.get(resourcePath);
        MockHttpServletResponse response = mockMvc.perform(requestBuilder).andReturn().getResponse();
        String responseBody = response.getContentAsString();
        //THEN
        assertEquals(200, response.getStatus());
        assertEquals(expected, responseBody);
    }

    @Test
    void expectFallbackResource_whenRequestingNonExistingResource() throws Exception {
        //GIVEN
        String resourcePath = "/non-existing-resource.csv";
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.get(resourcePath);
        //WHEN
        MockHttpServletResponse response = mockMvc.perform(requestBuilder).andReturn().getResponse();
        //THEN
        assertEquals(200, response.getStatus());
    }
}
