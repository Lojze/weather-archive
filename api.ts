import { fetch } from 'undici'
const { JSDOM } = require('jsdom');

export type RealtimeData = {
    nameen: string;
    cityname: string;
    city: string;
    temp: string;
    tempf: string;
    wde: string;
    WS: string;
    wse: string;
    SD: string;
    sd: string;
    qy: string;
    njd: string;
    time: string;
    rain: string;
    rain24h: string;
    aqi: string;
    aqi_pm25: string;
    weather: string;
    weathere: string;
    weathercode: string;
    limitnumber: string;
    date: string;
};

export type WeatherDataPart = {
    date?: string;
    weather?: string;
    sky?: string; // day
    temp?: string;
    tempUnit?: string;
    wind: {
        direction?: string;
        directionCode?: string;
        level?: string;
    };
    sunrise?: string; // day
    sunset?: string; // night
};

export type WeatherData = {
    day: WeatherDataPart;
    night: WeatherDataPart;
};

export async function getRealtimeData(id: string): Promise<RealtimeData> {
    const result = JSON.parse(
        await (
            await (
                await fetch(`http://d1.weather.com.cn/sk_2d/${id}.html`, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
                        Referer: "http://www.weather.com.cn/",
                    },
                })
            ).text()
        ).replace("var dataSK=", ""),
    );

    return result;
}

export async function getWeatherData(id: string): Promise<WeatherData> {
    const resp = await fetch(`http://www.weather.com.cn/weather1d/${id}.shtml`);
    const data = await resp.text();
    const dom = new JSDOM(data);
    if (dom == null) throw new Error("Failed to parse HTML");
    const document = dom.window.document;
    const today = document.querySelector('#today > div.t > ul');
    const liElements = today.children;
    if (!liElements) throw new Error("Failed to find li elements")

    const [day, night] = liElements;

    const dayDate = day.querySelector("h1")?.textContent;
    const dayWeather = day.querySelector("p.wea")?.textContent;
    const daySky = day.querySelector("p.sky > span")?.textContent;
    const dayTemp = day.querySelector("p.tem > span")?.textContent;
    const dayTempUnit = day.querySelector("p.tem > em")?.textContent;
    const dayWindDirection = day
        .querySelector("p.win > span")
        ?.getAttribute("title");
    const dayWindDirectionCode = day
        .querySelector("p.win > i")
        ?.getAttribute("class");
    const dayWindLevel = day.querySelector("p.win > span")?.textContent;
    const daySunrise = day.querySelector("p.sun > span")?.textContent;

    const nightDate = night.querySelector("h1")?.textContent;
    const nightWeather = night.querySelector("p.wea")?.textContent;
    const nightTemp = night.querySelector("p.tem > span")?.textContent;
    const nightTempUnit = night.querySelector("p.tem > em")?.textContent;
    const nightWindDirection = night
        .querySelector("p.win > span")
        ?.getAttribute("title");
    const nightWindDirectionCode = night
        .querySelector("p.win > i")
        ?.getAttribute("class");
    const nightWindLevel = night.querySelector("p.win > span")?.textContent;
    const nightSunset = night.querySelector("p.sun > span")?.textContent;
    return {
        day: {
            date: dayDate,
            weather: dayWeather,
            sky: daySky,
            temp: dayTemp,
            tempUnit: dayTempUnit,
            wind: {
                direction: dayWindDirection ?? undefined,
                directionCode: dayWindDirectionCode ?? undefined,
                level: dayWindLevel,
            },
            sunrise: daySunrise,
        },
        night: {
            date: nightDate,
            weather: nightWeather,
            temp: nightTemp,
            tempUnit: nightTempUnit,
            wind: {
                direction: nightWindDirection ?? undefined,
                directionCode: nightWindDirectionCode ?? undefined,
                level: nightWindLevel,
            },
            sunset: nightSunset,
        },
    }
}
