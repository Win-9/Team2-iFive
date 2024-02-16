import styles from "./DayList.module.scss";
import { LabelledList } from "../common/Layout/LabelledList";
import { SEARCH_PAGE } from "../../constants/constants";

const DEFAULT_TIME = { hour: 8, min: 10 };

export function DayList({ schedule, setSchedule }) {
    const handleWeekClick = (day) => {
        setSchedule((prevTimeList) => {
            const newTimeList = { ...prevTimeList };
            if (newTimeList[day]) {
                delete newTimeList[day];
            } else {
                newTimeList[day] = DEFAULT_TIME;
            }
            return newTimeList;
        });
    };

    const dayListElement = SEARCH_PAGE.WEEK.map((day) => (
        <li
            key={day}
            className={`${styles.dayItem} ${schedule[day] && styles.active}`}
            onClick={(event) => handleWeekClick(day, event)}
        >
            <p>{day[0]}</p>
        </li>
    ));

    return (
        <LabelledList articleStyle="dayBox" label="픽업 요일">
            {dayListElement}
        </LabelledList>
    );
}
