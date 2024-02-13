import { useState } from "react";
import styles from "./Search.module.scss";
import { Header } from "@/components/common/Header/Header";
import { Footer } from "@/components/common/Footer/Footer";
import { TimeItem } from "@/components/Search/TimeItem";
import Modal from "../../components/Search/Modal";
import { useSearchParams } from "react-router-dom";

const weekDays = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일"
];

export default function Search() {
    const [timeList, setTimeList] = useState(["일요일"]);
    const [modalOpen, setModalOpen] = useState(false);
    const [mapType, setMapType] = useState("");
    const [searchParams] = useSearchParams();
    const [departure, destination] = [
        searchParams.get("departure") || "출발지",
        searchParams.get("destination") || "도착지"
    ];

    const handleOpenModal = ({ target: { name } }) => {
        setMapType(name);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const dayListElement = weekDays.map((day) => (
        <li key={day} className={styles.dayItem}>
            {day[0]}
        </li>
    ));

    const timeListElement = timeList.length ? (
        timeList.map((day, index) => (
            <TimeItem day={day} key={`day-${index}`} />
        ))
    ) : (
        <li className={styles.timeEmpty}>픽업 요일을 선택해주세요</li>
    );

    return (
        <>
            <main className={styles.container}>
                <Header title="픽업 신청" />
                <section className={styles.contents}>
                    <form className={styles.locationForm}>
                        <label className={styles.locationLabel}>
                            출발지/도착지
                        </label>
                        <input
                            type="button"
                            className={styles.locationInput}
                            name="출발지"
                            value={departure}
                            onClick={handleOpenModal}
                        />
                        <input
                            type="button"
                            className={styles.locationInput}
                            name="도착지"
                            value={destination}
                            onClick={handleOpenModal}
                        />
                    </form>
                    <article className={styles.dayBox}>
                        <label className={styles.dayLabel}>픽업 요일</label>
                        <ul className={styles.dayList}>{dayListElement}</ul>
                    </article>
                    <article className={styles.time}>
                        <label className={styles.timeLabel}>픽업 시간</label>
                        <ul className={styles.timeList}>{timeListElement}</ul>
                    </article>
                </section>
                <Footer text="확인" />
                <Modal
                    type={mapType}
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                />
            </main>
        </>
    );
}
