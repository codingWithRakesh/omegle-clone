package com.main_server.main_server.service;

import com.main_server.main_server.dto.LogicRequestDto;
import com.main_server.main_server.dto.LogicResponseDto;
import org.jspecify.annotations.Nullable;

public interface LogicService {

    LogicResponseDto assignRoom(LogicRequestDto logicRequestDto);
}
