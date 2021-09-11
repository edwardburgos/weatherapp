export type City = {
    name: string;
    country: string;
    flag: string;
    weather: string;
    weatherIconId: string;
    temperature: number;
    windSpeed: number;
}

export type Flags = {
    [key: string]: {default: string}
}