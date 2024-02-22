import { useLoaderData } from "react-router-dom";
import { getKidInfo } from "../../service/api";
import styles from "./Menu.module.scss";
import { MenuButton } from "./MenuButton";
import iDropGreen from "@/assets/iDropGreen.svg";
import {
    DriverBottomSheet,
    ParentBottomSheet
} from "../../components/common/Bottomsheet/Bottomsheet";
import Location from "@/assets/Location.svg";
import Star from "@/assets/Star.svg";
import Success from "@/assets/Success.svg";
import User from "@/assets/user_icon.svg";
import Calender from "@/assets/calender.svg";
import Truck from "@/assets/truck.png";

const userName = null;
export function DriverMenu() {
    const childrenData = useLoaderData();

    return (
        <div className={styles.wrapper}>
            <img src={iDropGreen}></img>
            <div>
                <h1>안녕하세요, {userName || "육종호"}님 </h1>
                <span>오늘도 안전한 픽업 부탁드려요</span>
            </div>
            <div className={styles.menuContainer}>
                <MenuButton imgUrl={Calender} text="픽업 일정" route="" />
                <MenuButton
                    imgUrl={Truck}
                    text="픽업하기"
                    route="/pickup"
                    data={childrenData}
                />
                <MenuButton imgUrl={User} text="프로필" route="" />
                <MenuButton
                    imgUrl={Success}
                    text="요청 목록"
                    route="/pickup/request"
                />
            </div>
            <DriverBottomSheet childrenData={childrenData} />
        </div>
    );
}

export function ParentMenu() {

    const childrenData = useLoaderData();


    return (
        <div className={styles.wrapper}>
            <img src={iDropGreen}></img>
            <div>
                <h1>안녕하세요, {userName || "육종호"}님 </h1>
                <span>오늘도 안전하게 픽업할게요</span>
            </div>
            <div className={styles.menuContainer}>
                <MenuButton
                    imgUrl={Location}
                    text="실시간 픽업"
                    route="/map?type=parent"
                    data={childrenData}
                />
                <MenuButton
                    imgUrl={Success}
                    text="구독하기"
                    route="/subscription/search"
                />
                <MenuButton imgUrl={User} text="프로필" route="" />
                <MenuButton imgUrl={Star} text="이용내역" route="/history" />
            </div>

           <ParentBottomSheet childrenData={childrenData}/>

        </div>
    );
}

export async function fetchMenuData() {
    const childrenData = await getKidInfo("user/pickup/now");
    const result = parseData(childrenData.data);
    return result;
}

function parseData(childrenData) {
    return childrenData.map((element) => {
        return {
            ...element,
            startAddress: removeCityPrefix(element.startAddress),
            endAddress: removeCityPrefix(element.endAddress),
            startDate: formatDate(element.startDate),
            endDate: formatDate(element.endDate),
            pickUpStartTime: formatTime(element.pickUpStartTime),
            pickUpEndTime: formatTime(element.pickUpEndTime)
        };
    });
}

function removeCityPrefix(address) {
    return address !== null ? address.replace("서울특별시 ", "") : "null";
}

function formatDate(dateString) {
    return dateString !== null ? dateString.split("T")[0] : "null";
}

function formatTime(timeString) {
    return timeString !== undefined
        ? timeString.split("T")[1].slice(0, 5)
        : "null";
}
