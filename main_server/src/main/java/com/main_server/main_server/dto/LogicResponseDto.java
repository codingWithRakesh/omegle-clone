package com.main_server.main_server.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LogicResponseDto {
    private List<Room> roomList;
}
