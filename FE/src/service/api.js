import { BASE_URL } from "../constants/constants";
import { logout } from "../pages/Login/Login";
import { getAccessToken, getRefreshToken } from "../utils/auth";

/**
 * @param {Object} props
 * @param {string} props.id 사용자 ID
 * @param {string} props.password 사용자 비밀번호
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 * 로그인 성공 시 { success: true, data: Object },
 * 실패 시 { success: false, message: string } 반환
 */
export async function login({ id, password }) {
    try {
        const response = await fetch(`${BASE_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: id, password })
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                data
            };
        } else {
            // TODO 서버 에러코드 정해지면 에러처리
            return { success: false, message: "Login failed" };
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: error.toString() };
    }
}

// TODO - 배포 주소로 변경
async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    const response = await fetch("/api/refresh_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
    });

    if (response.ok) {
        const data = await response.json();
        setToken("accessToken", data.accessToken);
        setToken("refreshToken", data.refreshToken);
        return data.accessToken;
    } else {
        throw new Error("Refresh token is invalid or expired.");
    }
}

export async function sendAuthRequest(url, options = {}) {
    const accessToken = getAccessToken();
    if (accessToken) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`
        };
    }

    let response = await fetch(url, options);

    // TODO - 액세스 토큰이 만료되었을 경우 로직, status 코드 백엔드에 따라 변경 필요
    if (response.status === 401) {
        try {
            const newAccessToken = await refreshAccessToken();
            options.headers.Authorization = `Bearer ${newAccessToken}`;
            response = await fetch(url, options);
        } catch (error) {
            console.error("Session expired. User needs to login again.");
            logout();
        }
    }

    return response;
}

export async function fetchDrivers(subscriptionOption) {
    if (!subscriptionOption) return;

    try {
        const response = await sendAuthRequest(
            `${BASE_URL}/parent/search/drivers`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(subscriptionOption)
            }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Fetching drivers failed:", error);
    }
}

// 예시
async function submitReview(reviewData) {
    try {
        const response = await sendAuthRequest("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reviewData)
        });

        if (!response.ok) {
            console.error("Failed to submit review.");
        } else {
            console.log("Review submitted successfully.");
        }
    } catch (error) {
        console.error("Error submitting review:", error);
    }
}

export async function getDriverDetail(driverId) {
    try {
        const response = await sendAuthRequest(
            `${BASE_URL}/detail/driver/${driverId}`
        );

        if (!response.ok) {
            console.error("기사 상세정보 가져오기 실패.");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function postSubscribe(subscribeOption) {
    try {
        const response = await sendAuthRequest(`${BASE_URL}/parent/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscribeOption)
        });

        if (response.ok) {
            console.log("Review submitted successfully.");
        } else {
            console.error("구독 요청 실패.");
        }
    } catch (error) {
        throw error;
    }
}

export async function getKidInfo(parameter) {
    try {
        const response = await sendAuthRequest(`${BASE_URL}/${parameter}`);
        if (response.ok) {
            const kidInfo = await response.json();
            return kidInfo.data;
        } else {
            console.error("Failed to GET kid information");
            throw new Error("Failed to GET kid information");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Faild to GET request");
    }
}

export async function postKidInfo(kidData) {
    try {
        const response = await sendAuthRequest(`${BASE_URL}/driver/pickup`, {
            method: "POST",
            body: kidData
        });
        if (response.ok) {
            console.log("이미지 업로드 성공");
            return true;
        } else {
            const data = await response.json();
            alert(`${data.message}\n${data.solution}`);
            return false;
        }
    } catch (error) {
        throw error;
    }
}
