"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeatherData = exports.getRealtimeData = void 0;
const undici_1 = require("undici");
const { JSDOM } = require('jsdom');
function getRealtimeData(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = JSON.parse(yield (yield (yield (0, undici_1.fetch)(`http://d1.weather.com.cn/sk_2d/${id}.html`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
                Referer: "http://www.weather.com.cn/",
            },
        })).text()).replace("var dataSK=", ""));
        return result;
    });
}
exports.getRealtimeData = getRealtimeData;
function getWeatherData(id) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield (0, undici_1.fetch)(`http://www.weather.com.cn/weather1d/${id}.shtml`);
        const data = yield resp.text();
        const dom = new JSDOM(data);
        if (dom == null)
            throw new Error("Failed to parse HTML");
        const document = dom.window.document;
        const today = document.querySelector('#today > div.t > ul');
        const liElements = today.children;
        if (!liElements)
            throw new Error("Failed to find li elements");
        const [day, night] = liElements;
        const dayDate = (_a = day.querySelector("h1")) === null || _a === void 0 ? void 0 : _a.textContent;
        const dayWeather = (_b = day.querySelector("p.wea")) === null || _b === void 0 ? void 0 : _b.textContent;
        const daySky = (_c = day.querySelector("p.sky > span")) === null || _c === void 0 ? void 0 : _c.textContent;
        const dayTemp = (_d = day.querySelector("p.tem > span")) === null || _d === void 0 ? void 0 : _d.textContent;
        const dayTempUnit = (_e = day.querySelector("p.tem > em")) === null || _e === void 0 ? void 0 : _e.textContent;
        const dayWindDirection = (_f = day
            .querySelector("p.win > span")) === null || _f === void 0 ? void 0 : _f.getAttribute("title");
        const dayWindDirectionCode = (_g = day
            .querySelector("p.win > i")) === null || _g === void 0 ? void 0 : _g.getAttribute("class");
        const dayWindLevel = (_h = day.querySelector("p.win > span")) === null || _h === void 0 ? void 0 : _h.textContent;
        const daySunrise = (_j = day.querySelector("p.sun > span")) === null || _j === void 0 ? void 0 : _j.textContent;
        const nightDate = (_k = night.querySelector("h1")) === null || _k === void 0 ? void 0 : _k.textContent;
        const nightWeather = (_l = night.querySelector("p.wea")) === null || _l === void 0 ? void 0 : _l.textContent;
        const nightTemp = (_m = night.querySelector("p.tem > span")) === null || _m === void 0 ? void 0 : _m.textContent;
        const nightTempUnit = (_o = night.querySelector("p.tem > em")) === null || _o === void 0 ? void 0 : _o.textContent;
        const nightWindDirection = (_p = night
            .querySelector("p.win > span")) === null || _p === void 0 ? void 0 : _p.getAttribute("title");
        const nightWindDirectionCode = (_q = night
            .querySelector("p.win > i")) === null || _q === void 0 ? void 0 : _q.getAttribute("class");
        const nightWindLevel = (_r = night.querySelector("p.win > span")) === null || _r === void 0 ? void 0 : _r.textContent;
        const nightSunset = (_s = night.querySelector("p.sun > span")) === null || _s === void 0 ? void 0 : _s.textContent;
        return {
            day: {
                date: dayDate,
                weather: dayWeather,
                sky: daySky,
                temp: dayTemp,
                tempUnit: dayTempUnit,
                wind: {
                    direction: dayWindDirection !== null && dayWindDirection !== void 0 ? dayWindDirection : undefined,
                    directionCode: dayWindDirectionCode !== null && dayWindDirectionCode !== void 0 ? dayWindDirectionCode : undefined,
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
                    direction: nightWindDirection !== null && nightWindDirection !== void 0 ? nightWindDirection : undefined,
                    directionCode: nightWindDirectionCode !== null && nightWindDirectionCode !== void 0 ? nightWindDirectionCode : undefined,
                    level: nightWindLevel,
                },
                sunset: nightSunset,
            },
        };
    });
}
exports.getWeatherData = getWeatherData;
