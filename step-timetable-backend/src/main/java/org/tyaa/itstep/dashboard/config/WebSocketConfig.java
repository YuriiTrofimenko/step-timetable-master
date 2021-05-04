package org.tyaa.itstep.dashboard.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${custom.external.ip}")
    private String CUSTOM_EXTERNAL_IP;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // корневой адрес для подписки на WebSocket-сообщения
        config.enableSimpleBroker("/topic");
        // корневой адрес для отправки WebSocket-сообщений
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // объявление конечной точки для подключения WebSocket-клиентов
        // registry.addEndpoint("/websocket").setAllowedOrigins("http://localhost:3000");
        // registry.addEndpoint("/websocket").setAllowedOrigins("http://localhost:3000").withSockJS();
        registry.addEndpoint("/websocket").setAllowedOrigins(String.format("http://%s:3000", CUSTOM_EXTERNAL_IP));
        registry.addEndpoint("/websocket").setAllowedOrigins(String.format("http://%s:3000", CUSTOM_EXTERNAL_IP)).withSockJS();
    }
}
