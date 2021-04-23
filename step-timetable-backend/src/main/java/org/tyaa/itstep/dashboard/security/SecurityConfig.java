package org.tyaa.itstep.dashboard.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
@Order(1)
public class SecurityConfig extends WebSecurityConfigurerAdapter implements WebMvcConfigurer {

    private final MongoWebAuthProvider authProvider;

    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;

    private final SavedReqAwareAuthSuccessHandler savedReqAwareAuthSuccessHandler;

    @Value("${custom.external.ip}")
    private String CUSTOM_EXTERNAL_IP;

    public SecurityConfig(MongoWebAuthProvider authProvider, RestAuthenticationEntryPoint restAuthenticationEntryPoint, SavedReqAwareAuthSuccessHandler savedReqAwareAuthSuccessHandler) {
        this.authProvider = authProvider;
        this.restAuthenticationEntryPoint = restAuthenticationEntryPoint;
        this.savedReqAwareAuthSuccessHandler = savedReqAwareAuthSuccessHandler;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .cors()
            .and()
            .exceptionHandling()
            .authenticationEntryPoint(restAuthenticationEntryPoint)
            .and()
            .authorizeRequests()
            .antMatchers("/websocket/**").permitAll()
            .antMatchers(HttpMethod.GET, "/api/**").permitAll()
            .antMatchers(HttpMethod.POST, "/api/**").hasRole("ADMIN")
            .antMatchers(HttpMethod.PUT, "/api/**").hasRole("ADMIN")
            .antMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
            .antMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
            .antMatchers(HttpMethod.PUT, "/api/auth/**").permitAll()
            .antMatchers(HttpMethod.DELETE, "/api/auth/**").authenticated()
            .antMatchers("/api/**/admin/**").hasRole("ADMIN")
            .and()
            .formLogin()
            .successHandler(savedReqAwareAuthSuccessHandler)
            .failureUrl("/api/auth/users/onerror")
            .and()
            .logout()
            .clearAuthentication(true)
            .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
            .logoutSuccessUrl("/api/auth/users/signedout");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000", String.format("http://%s:3000", CUSTOM_EXTERNAL_IP))
            .allowedMethods("*")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(8600);
    }
}
