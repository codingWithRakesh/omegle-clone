package com.main_server.main_server.controller;

import com.main_server.main_server.dto.LogicRequestDto;
import com.main_server.main_server.dto.LogicResponseDto;
import com.main_server.main_server.service.LogicService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/logic")
@AllArgsConstructor
public class LogicController {

    private final LogicService logicService;

    @PostMapping("/check")
    ResponseEntity<LogicResponseDto> setRoom(@RequestBody LogicRequestDto logicRequestDto){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(logicService.assignRoom(logicRequestDto));
    }

    @DeleteMapping("/remove")
    ResponseEntity<Void> removeFromRoom(@RequestBody LogicRequestDto logicRequestDto){
        logicService.removeUserId(logicRequestDto);
        return ResponseEntity
                .noContent()
                .build();
    }

    @GetMapping("/isHave")
    ResponseEntity<Map<String,Boolean>> isUserIdInQueue(@RequestBody LogicRequestDto logicRequestDto){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(logicService.isHaveInQueue(logicRequestDto));
    }

    @GetMapping("/isEmpty")
    ResponseEntity<Map<String,Boolean>> isQueueEmpty() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("isEmpty", logicService.isQueueEmpty()));

    }

    @GetMapping("/allQueueUserIds")
    ResponseEntity<List<String>> getAllQueueUserIds() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(logicService.getAllQueueUserIds());
    }
}
