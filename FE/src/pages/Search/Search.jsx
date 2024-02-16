import { useState } from "react";
import styles from "./Search.module.scss";
import { Header } from "@/components/common/Header/Header";
import { Footer } from "@/components/common/Footer/Footer";
import { Modal } from "@/components/Search/Modal";
import { SEARCH_PAGE } from "@/constants/constants";
import { AddressForm } from "@/components/Search/AddressForm";
import { DayList } from "../../components/Search/DayList";
import { TimeList } from "../../components/Search/TimeList";

const INITIAL_LOCATIION_STATE = {
    address: "",
    latitude: "",
    longitude: ""
};

export default function Search() {
    const [schedule, setSchedule] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [mapFor, setMapFor] = useState("");

    const [location, setLocation] = useState({
        departure: { ...INITIAL_LOCATIION_STATE },
        destination: { ...INITIAL_LOCATIION_STATE }
    });

    const handleOpenModal = ({ target: { name } }) => {
        setMapFor(name);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSubmit = () => {
        console.log(schedule);
        navigate("/subscription/drivers");
    };

    // 상위에서 이렇게 함수를 만들어서 넘겨주는게 좋은지 set함수만 넘기고 사용하는 곳에서 함수로 만드는 것이 좋은지 모르겠음
    const handleLocationSelect = (data) => {
        setLocation((prevLocation) => ({
            ...prevLocation,
            [mapFor]: data
        }));
    };

    const handleScheduleChange = (day, unit) => (value) => {
        setSchedule((prevSchedule) => ({
            ...prevSchedule,
            [day]: { ...prevSchedule[day], [unit]: value }
        }));
    };

    return (
        <>
            <main className={styles.container}>
                <Header title="픽업 신청" to="/" />
                <section className={styles.contents}>
                    <AddressForm
                        handleOpenModal={handleOpenModal}
                        location={location}
                    />
                    <DayList schedule={schedule} setSchedule={setSchedule} />
                    <TimeList
                        schedule={schedule}
                        handleScheduleChange={handleScheduleChange}
                    />
                </section>
                <Footer text="확인" onClick={handleSubmit} />
                <Modal
                    mapFor={mapFor}
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    location={location}
                    handleLocationSelect={handleLocationSelect}
                />
            </main>
        </>
    );
}
