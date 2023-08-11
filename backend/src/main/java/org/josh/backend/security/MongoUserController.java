package org.josh.backend.security;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.josh.backend.dto.LoginData;
import org.josh.backend.dto.UserWithoutId;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class MongoUserController {

    private final MongoUserDetailsService mongoUserDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @GetMapping("/me")
    public String getUserInfo() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginData loginData) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken((loginData.username()), loginData.password()));
        return jwtService.createToken(loginData.username());
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody UserWithoutId userWithoutId) {
        mongoUserDetailsService.registerNewUser(userWithoutId);
        return "registered user " + userWithoutId.name();

    }

}
