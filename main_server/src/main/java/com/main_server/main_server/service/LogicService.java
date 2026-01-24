package com.main_server.main_server.service;

import com.main_server.main_server.dto.LogicRequestDto;
import com.main_server.main_server.dto.LogicResponseDto;

import java.util.Map;

public interface LogicService {

    LogicResponseDto assignRoom(LogicRequestDto logicRequestDto);

    void removeUserId(LogicRequestDto logicRequestDto);

    Map<String, Boolean> isHaveInQueue(LogicRequestDto logicRequestDto);
}
