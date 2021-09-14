export type City = {
    name: string;
    country: string;
    flag: string;
    weather: string;
    weatherIcon: string;
    temperature: number;
    windSpeed: number;
}

export type Flags = {
    [key: string]: {default: string}
}

export type AvailableCity = {
    name: string,
    country: string
};

export type Country = {
    code: string,
    name: string
}