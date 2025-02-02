export interface WeatherData {
    temp: number
    icon: string
    name: string
    description: string
}

export const getCurrentWeather = async (city: string, openweathermapApiKey: string): Promise<WeatherData> => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openweathermapApiKey}`)
    if (!response.ok) throw new Error(`Weather request failed with status: ${response.status}`)
    const data = await response.json()
    return { temp: data.main.temp, icon: data.weather[0].icon, name: data.name, description: data.weather[0].description }
}

export const getCityCoords = async (cityName: string, openweathermapApiKey: string): Promise<string> => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openweathermapApiKey}`)
    if (!response.ok) throw new Error(`City request failed with status: ${response.status}`)
    const data = await response.json()
    return `${data.coord.lon},${data.coord.lat}`
}