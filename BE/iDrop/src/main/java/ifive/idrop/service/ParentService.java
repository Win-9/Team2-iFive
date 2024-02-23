package ifive.idrop.service;


import ifive.idrop.dto.response.BaseResponse;
import ifive.idrop.dto.request.SubscribeRequest;
import ifive.idrop.dto.response.CurrentPickUpResponse;

import ifive.idrop.dto.response.PickUpHistoryResponse;
import ifive.idrop.dto.response.ParentSubscribeInfoResponse;
import ifive.idrop.entity.*;
import ifive.idrop.entity.enums.PickUpStatus;
import ifive.idrop.exception.CommonException;
import ifive.idrop.exception.ErrorCode;
import ifive.idrop.repository.DriverRepository;
import ifive.idrop.repository.ParentRepository;
import ifive.idrop.repository.PickUpRepository;
import ifive.idrop.util.Parser;
import ifive.idrop.util.ScheduleUtils;
import lombok.RequiredArgsConstructor;
import org.json.JSONException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static ifive.idrop.util.ScheduleUtils.calculateEndDate;
import static ifive.idrop.util.ScheduleUtils.calculateStartDate;

@Service
@RequiredArgsConstructor
public class ParentService {
    private final DriverRepository driverRepository;
    private final ParentRepository parentRepository;
    private final PickUpRepository pickUpRepository;

    @Transactional
    public BaseResponse<String> createSubscribe(Parent parent, SubscribeRequest subscribeRequest) throws JSONException {
        Driver driver = driverRepository.findById(subscribeRequest.getDriverId())
                .orElseThrow(() -> new CommonException(ErrorCode.DRIVER_NOT_EXIST));
        Child child = parentRepository.findChild(parent.getId())
                .orElseThrow(() -> new CommonException(ErrorCode.CHILD_NOT_EXIST));

        PickUpSubscribe subscribe = createPickUpSubscribe();
        PickUpLocation location = createPickUpLocation(subscribeRequest);
        PickUpInfo pickUpInfo = createPickUpInfo(subscribeRequest, child, driver, location, subscribe);

        //TODO Alarm to Driver
        return BaseResponse.success();
    }

    @Transactional(readOnly = true)
    public BaseResponse<List<CurrentPickUpResponse>> getChildRunningInfo(Parent parent) {
        List<Object[]> runningPickInfo = parentRepository.findRunningPickUpInfo(parent.getId());
        return BaseResponse.of("Data Successfully Proceed",
                runningPickInfo.stream()
                        .map(o -> CurrentPickUpResponse.of((PickUpInfo) o[0], (LocalDateTime) o[1]))
                        .toList());
    }

    private PickUpSubscribe createPickUpSubscribe() {
        PickUpSubscribe subscribe = PickUpSubscribe.builder()
                .status(PickUpStatus.WAIT)
                .requestDate(LocalDateTime.now())
                .build();
        pickUpRepository.savePickUpSubscribe(subscribe);
        return subscribe;
    }

    private PickUpInfo createPickUpInfo(SubscribeRequest subscribeRequest, Child child, Driver driver, PickUpLocation location, PickUpSubscribe subscribe) {
        PickUpInfo pickUpInfo = PickUpInfo.builder()
                .child(child)
                .driver(driver)
                .schedule(subscribeRequest.getSchedule().toJSONString())
                .build();
        pickUpInfo.updatePickUpSubscribe(subscribe);
        pickUpInfo.updatePickUpLocation(location);
        pickUpRepository.savePickUpInfo(pickUpInfo);
        return pickUpInfo;
    }

    private PickUpLocation createPickUpLocation(SubscribeRequest subscribeRequest) {
        PickUpLocation location = PickUpLocation.builder()
                .startAddress(subscribeRequest.getStartAddress())
                .startLatitude(subscribeRequest.getStartLatitude())
                .startLongitude(subscribeRequest.getStartLongitude())
                .endAddress(subscribeRequest.getEndAddress())
                .endLatitude(subscribeRequest.getEndLatitude())
                .endLongitude(subscribeRequest.getEndLongitude())
                .build();
        pickUpRepository.savePickUpLocation(location);
        return location;
    }

    public BaseResponse<List<PickUpHistoryResponse>> getPickUpHistoryInfo(Parent parent, long pickInfoId) {
        List<PickUp> pickUpList = pickUpRepository.findPickUpByPickUpInfoIdAndParentIdOrderByReservedTime(parent.getId(), pickInfoId);
        return BaseResponse.of("Data Successfully Proceed",
                pickUpList.stream().map(PickUpHistoryResponse::toEntity)
                        .toList());
    }

    @Transactional(readOnly = true)
    public List<ParentSubscribeInfoResponse> subscribeList(Long parentId) {
        List<PickUpInfo> pickUpInfoList = pickUpRepository.findPickUpInfoByParentIdInTheLatestOrder(parentId);
        return pickUpInfoList.stream().map(ParentSubscribeInfoResponse::of).toList();
    }

    @Transactional(readOnly = true)
    public boolean hasCurrentPickUp(Long parentId) {
        return pickUpRepository.getCurrentPickUpSize(parentId) != 0;
    }
}
