package ifive.idrop.controller;

import ifive.idrop.dto.request.DriverListRequest;
import ifive.idrop.dto.response.DriverDetailResponse;
import ifive.idrop.dto.response.DriverListResponse;
import ifive.idrop.entity.Driver;
import ifive.idrop.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import ifive.idrop.annotation.Login;
import ifive.idrop.dto.response.BaseResponse;
import ifive.idrop.dto.request.SubscribeRequest;
import ifive.idrop.entity.Parent;
import ifive.idrop.service.ParentService;
import org.json.JSONException;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@RestController
@RequestMapping("/parent")
public class ParentController {
    private final DriverService driverService;
    private final ParentService parentService;

    @PostMapping("/search/drivers")
    public DriverListResponse searchDrivers(@RequestBody DriverListRequest driverListRequest) {
        DriverListResponse driverListResponse = new DriverListResponse();

        List<Driver> drivers = driverService.searchAvailableDrivers(driverListRequest);

        for (Driver driver : drivers) {
            driverListResponse.addDriverSummary(driver.getSummary());
        }
        return driverListResponse;
    }

    @PostMapping("/subscribe")
    public BaseResponse<String> subscribeDriver(@Login Parent parent, @RequestBody SubscribeRequest request) throws JSONException {
        return parentService.createSubscribe(parent, request);
    }

    @GetMapping("/pickup/now")
    public BaseResponse checkPickUpInfo(@Login Parent parent) {
        return parentService.getChildRunningInfo(parent);
    }
}