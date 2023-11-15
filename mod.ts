import { fetch } from 'undici'
import { format } from 'date-fns';
import { RealtimeData, WeatherData, getRealtimeData, getWeatherData } from './api';
const fs = require('fs').promises;

(async () => {
    const cityDataResp = await fetch('https://j.i8tq.com/weather2020/search/city.js');
    const buffer = await cityDataResp.arrayBuffer();
    const decoder = new TextDecoder("utf-8");
    let cityData = decoder.decode(buffer);
    cityData = JSON.parse(cityData.replace("var city_data = ", ""));

    type CityData = {
        id: string;
        province: string;
        city: string;
        realtime?: RealtimeData;
        weather?: WeatherData;
    };
    // const cities: CityData[] = Object.entries(cityData).map(([key, value]) => {
    //     const [c, v]: [string, any] = Object.entries(value)[0];
    //     const city = v[c] as Record<"AREAID" | "NAMECN", string>;
    //     return {
    //         id: city.AREAID,
    //         province: key,
    //         city: city.NAMECN,
    //     }
    // });
    const cities: CityData[] = Object.entries(cityData).flatMap(([key, values]) =>
        Object.entries(values).map(([c, v]: [string, any]) => {
            const city = v[c] as Record<"AREAID" | "NAMECN", string>;
            return {
                id: city.AREAID,
                province: key,
                city: city.NAMECN,
            }
        })
    );

    const today = new Date();
    const date = format(today, "yyyy-MM-dd");
    const datetime = format(today, "yyyy-MM-dd HH:mm:ss");

    for (const city of cities) {
        city.realtime = await getRealtimeData(city.id);
        city.weather = await getWeatherData(city.id);
    }

    try {
        await fs.mkdir(`weathers/${date}`, { recursive: true });
    } catch {
        // ignore
    }

    const content = JSON.stringify(
        {
            timestamp: today.getTime(),
            lastUpdate: datetime,
            data: cities,
        },
        null,
        2,
    );
    
    await fs.writeFile(`weathers/${date}/${datetime.replace(/ /g, "_").replace(/:/g, "_")}.json`, content);

    await fs.writeFile(`weathers/${date}/latest.json`, content);
    await fs.writeFile(`weathers/latest.json`, content);
    

})();