package com.main_server.main_server.service.impl;

import com.main_server.main_server.dto.LogicRequestDto;
import com.main_server.main_server.dto.LogicResponseDto;
import com.main_server.main_server.dto.Room;
import com.main_server.main_server.service.LogicService;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

@Service
public class LogicServiceImpl implements LogicService {
   private Queue<Room> queue = new LinkedList<>();


    @Override
    public LogicResponseDto assignRoom(LogicRequestDto logicRequestDto) {
        List<Room> roomList = new ArrayList<>();

        if (logicRequestDto.getUserId2() == null){
            if (!queue.isEmpty()){
                Room room = queue.poll();
                room.setUserId2(logicRequestDto.getUserId1());
                roomList.add(room);
            } else{
                Room room = Room.builder().userId1(logicRequestDto.getUserId1()).build();
                queue.add(room);
            }
        } else{
            boolean isRoomCreatedForUserId2 = false;
            if (!queue.isEmpty()){
                Room room = queue.poll();
                room.setUserId2(logicRequestDto.getUserId1());
                roomList.add(room);
            } else{
                Room room1 = Room.builder().userId1(logicRequestDto.getUserId1()).build();
                Room room2 = Room.builder().userId1(logicRequestDto.getUserId2()).build();
                queue.add(room1);
                queue.add(room2);
                isRoomCreatedForUserId2 = true;
            }

            if (!isRoomCreatedForUserId2){
                if (!queue.isEmpty()){
                    Room room = queue.poll();
                    room.setUserId2(logicRequestDto.getUserId2());
                    roomList.add(room);
                }else {
                    Room room = Room.builder().userId1(logicRequestDto.getUserId2()).build();
                    queue.add(room);
                }
            }
        }

        return LogicResponseDto.builder().roomList(roomList).build();
    }
}
