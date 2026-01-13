package com.main_server.main_server.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Room {
    private String userId1;
    private String userId2;
}
