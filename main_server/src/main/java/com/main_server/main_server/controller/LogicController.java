package com.main_server.main_server.controller;

import com.main_server.main_server.dto.LogicRequestDto;
import com.main_server.main_server.dto.LogicResponseDto;
import com.main_server.main_server.service.LogicService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/logic")
@AllArgsConstructor
public class LogicController {

    private final LogicService logicService;

    @PostMapping("/check")
    ResponseEntity<LogicResponseDto> setRoom(@RequestBody LogicRequestDto logicRequestDto){
        return ResponseEntity.status(HttpStatus.OK).body(logicService.assignRoom(logicRequestDto));
    }

}
