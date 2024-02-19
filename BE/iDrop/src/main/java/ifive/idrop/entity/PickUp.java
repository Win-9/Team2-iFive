package ifive.idrop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Slf4j
@Entity
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Getter
public class PickUp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pickup_id")
    private Long id;

    private String startImage;
    private String endImage;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime reservedTime;
    private String startMessage;
    private String endMessage;

    @ManyToOne
    @JoinColumn(name = "pickup_info_id")
    private PickUpInfo pickUpInfo;

    public void updatePickUpInfo(PickUpInfo pickUpInfo) {
        this.pickUpInfo = pickUpInfo;
        pickUpInfo.getPickUpList().add(this);
    }

    public void updateStartPickUpInfo(String startImage, LocalDateTime startTime, String startMessage) {
        this.startImage = startImage;
        this.startTime = startTime;
        this.startMessage = startMessage;
    }

    public boolean isDriver(Driver driver) {
        return pickUpInfo.getDriver().getId().equals(driver.getId());
    }

    public Child getChild() {
        return pickUpInfo.getChild();
    }
}
