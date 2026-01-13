package com.main_server.main_server.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {

    @Bean
    private ModelMapper modelMapper(){
        return new ModelMapper();
    }
}
