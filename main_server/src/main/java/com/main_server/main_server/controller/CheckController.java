package com.main_server.main_server.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/check")
public class CheckController {
    @GetMapping("/isWorking")
    ResponseEntity<Map<String, Object>> check(){
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("status","running"));
    }
}
