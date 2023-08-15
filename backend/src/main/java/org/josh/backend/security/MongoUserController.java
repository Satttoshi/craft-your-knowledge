package org.josh.backend.security;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.josh.backend.dto.UserWithoutId;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class MongoUserController {

    private final MongoUserDetailsService mongoUserDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @GetMapping("/me")
    public String getUserInfo(Principal principal) {
        if (principal != null) {
            return principal.getName();
        } else {
            return "anonymousUser";
        }
    }

    @PostMapping("/login")
    public String login(@RequestBody UserWithoutId loginData) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken((loginData.username()),
            loginData.password()));
        return jwtService.createToken(loginData.username());
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody UserWithoutId userWithoutId) {
        mongoUserDetailsService.registerNewUser(userWithoutId);
        return "registered user " + userWithoutId.username();

    }

}
