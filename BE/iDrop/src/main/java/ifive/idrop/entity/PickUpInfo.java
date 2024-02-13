package ifive.idrop.entity;

import jakarta.persistence.*;

@Entity
public class PickUpInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pickup_info_id")
    private Long id;
    @OneToOne
    @JoinColumn(name = "pickup_location_id")
    private PickUpLocation pickUpLocation;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "child_id")
    private Child child;

    private String schedule;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "pickUpInfo")
    private PickUpSubscribe pickUpSubscribe;
}