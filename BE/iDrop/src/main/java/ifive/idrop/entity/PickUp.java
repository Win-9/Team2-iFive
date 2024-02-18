package ifive.idrop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
    private String message;

    @ManyToOne
    @JoinColumn(name = "pickup_info_id")
    private PickUpInfo pickUpInfo;

    public void updatePickUpInfo(PickUpInfo pickUpInfo) {
        this.pickUpInfo = pickUpInfo;
        pickUpInfo.getPickUpList().add(this);
    }
}
