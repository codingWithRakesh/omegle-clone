package com.main_server.main_server.controller;

import com.main_server.main_server.dto.LogicRequestDto;
import com.main_server.main_server.dto.LogicResponseDto;
import com.main_server.main_server.service.LogicService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/logic")
@AllArgsConstructor
public class LogicController {

    private final LogicService logicService;

    ResponseEntity<LogicResponseDto> setRoom(@RequestBody LogicRequestDto logicRequestDto){
        return ResponseEntity.status(HttpStatus.OK).body(logicService.assignRoom(logicRequestDto));
    }

}
