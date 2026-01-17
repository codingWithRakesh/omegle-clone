package com.main_server.main_server.service.impl;

import com.main_server.main_server.dto.LogicRequestDto;
import com.main_server.main_server.dto.LogicResponseDto;
import com.main_server.main_server.dto.Room;
import com.main_server.main_server.service.LogicService;
import com.main_server.main_server.util.CommonUtil;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class LogicServiceImpl implements LogicService {
   private final Queue<Room> queue = new LinkedList<>();
   private final Set<String> roomData = new HashSet<>();
   private final Object lock = new Object();

    @Override
    public LogicResponseDto assignRoom(LogicRequestDto logicRequestDto) {
        List<Room> roomList = new ArrayList<>();

        if (logicRequestDto.getUserId2() == null){
            if (!queue.isEmpty()){
                Room room = queue.poll();
                room.setUserId2(logicRequestDto.getUserId1());
                roomList.add(room);
            } else{
                Room room = Room.builder().userId1(logicRequestDto.getUserId1()).roomId(CommonUtil.generateUniqueId()).build();
                queue.add(room);
            }
        } else{
            synchronized(lock){
                if (!roomData.add(logicRequestDto.getRoomId())){
                    return LogicResponseDto.builder().roomList(roomList).build();
                }
            }

            boolean isRoomCreatedForUserId2 = false;
            if (!queue.isEmpty()){
                Room room = queue.poll();
                room.setUserId2(logicRequestDto.getUserId1());
                roomList.add(room);
            } else{
                Room room1 = Room.builder().userId1(logicRequestDto.getUserId1()).roomId(CommonUtil.generateUniqueId()).build();
                Room room2 = Room.builder().userId1(logicRequestDto.getUserId2()).roomId(CommonUtil.generateUniqueId()).build();
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
                    Room room = Room.builder().userId1(logicRequestDto.getUserId2()).roomId(CommonUtil.generateUniqueId()).build();
                    queue.add(room);
                }
            }
        }

        return LogicResponseDto.builder().roomList(roomList).build();
    }
}
