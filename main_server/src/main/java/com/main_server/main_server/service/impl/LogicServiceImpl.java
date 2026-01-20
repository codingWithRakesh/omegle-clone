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
    private final Map<String, Map<String, Long>> recent = new HashMap<>();
    private final long COOLDOWN_MS = 60_000; // 1 min

    private final Set<String> roomData = new HashSet<>();
    private final Object lock = new Object();

    public boolean isAllowed(LogicRequestDto currentUser, String candidate) {
        if (recent.get(currentUser.getUserId1()) != null) {
            if (recent.get(currentUser.getUserId1()).containsKey(candidate)) {
                Long time = recent.get(currentUser.getUserId1()).get(candidate);
                Long diffrentTime = System.currentTimeMillis() - time;

                if (COOLDOWN_MS < diffrentTime) {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
        return false;
    }

    public boolean removeIfExist(LogicRequestDto logicRequestDto){
        String targetUserId = logicRequestDto.getUserId1();
        boolean removed = false;

        List<Room> kept = new ArrayList<>();

        while(!queue.isEmpty()){
            Room room = queue.poll();

            if (targetUserId.equals(room.getUserId1())){
                removed = true;
                continue;
            }
            kept.add(room);
        }
        queue.addAll(kept);
        return removed;
    }

    @Override
    public LogicResponseDto assignRoom(LogicRequestDto logicRequestDto) {
        List<Room> roomList = new ArrayList<>();
        List<Room> skipped = new ArrayList<>();

        synchronized (lock) {
            if (!roomData.add(logicRequestDto.getUserId1())) {
                return LogicResponseDto.builder().roomList(roomList).build();
            }
        }

        removeIfExist(logicRequestDto);

        Room found = null;
        String candidate = null;
        while (!queue.isEmpty()) {
            Room r = queue.poll();
            candidate = r.getUserId1(); // waiting user
            if (isAllowed(logicRequestDto, candidate)) {
                found = r;
                break;
            } else {
                skipped.add(r);
            }
        }
        queue.addAll(skipped);

        if (found != null) {
            Room buildRoom = Room.builder()
                    .userId1(candidate)
                    .userId2(logicRequestDto.getUserId1())
                    .roomId(CommonUtil.generateUniqueId())
                    .build();
            recent.put(logicRequestDto.getUserId1(), Map.of(candidate, System.currentTimeMillis()));
            return LogicResponseDto.builder()
                    .roomList(List.of(buildRoom))
                    .build();
        } else {
            Room newRoom = Room.builder()
                    .userId1(logicRequestDto.getUserId1())
                    .build();
            queue.add(newRoom);
        }

        return LogicResponseDto.builder()
                .roomList(roomList)
                .build();
    }
}
