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
const undici_1 = require("undici");
const date_fns_1 = require("date-fns");
const api_1 = require("./api");
const fs = require('fs').promises;
(() => __awaiter(void 0, void 0, void 0, function* () {
    const cityDataResp = yield (0, undici_1.fetch)('https://j.i8tq.com/weather2020/search/city.js');
    const buffer = yield cityDataResp.arrayBuffer();
    const decoder = new TextDecoder("utf-8");
    let cityData = decoder.decode(buffer);
    cityData = JSON.parse(cityData.replace("var city_data = ", ""));
    // const cities: CityData[] = Object.entries(cityData).map(([key, value]) => {
    //     const [c, v]: [string, any] = Object.entries(value)[0];
    //     const city = v[c] as Record<"AREAID" | "NAMECN", string>;
    //     return {
    //         id: city.AREAID,
    //         province: key,
    //         city: city.NAMECN,
    //     }
    // });
    const cities = Object.entries(cityData).flatMap(([key, values]) => Object.entries(values).map(([c, v]) => {
        const city = v[c];
        return {
            id: city.AREAID,
            province: key,
            city: city.NAMECN,
        };
    }));
    const today = new Date();
    const date = (0, date_fns_1.format)(today, "yyyy-MM-dd");
    const datetime = (0, date_fns_1.format)(today, "yyyy-MM-dd HH:mm:ss");
    // for (const city of cities) {
    //     city.realtime = await getRealtimeData(city.id);
    //     city.weather = await getWeatherData(city.id);
    // }
    const s = yield (0, api_1.getWeatherData)('101010100');
    try {
        yield fs.mkdir(`weathers/${date}`, { recursive: true });
    }
    catch (_a) {
        // ignore
    }
    const content = JSON.stringify({
        timestamp: today.getTime(),
        lastUpdate: datetime,
        data: cities,
    }, null, 2);
    // await fs.writeFile(`weathers/${date}/${datetime.replace(/ /g, "_").replace(/:/g, "_")}.json`, content);
    // await fs.writeFile(`weathers/${date}/latest.json`, content);
    // await fs.writeFile(`weathers/latest.json`, content);
}))();
