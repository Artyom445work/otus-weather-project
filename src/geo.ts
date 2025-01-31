export const getCurrentCity = async (): Promise<{ cityName: string; ll: string }> => {
    const response = await fetch(`https://get.geojs.io/v1/ip/geo.json`)
    if (!response.ok) throw new Error(`Request failed with status: ${response.status}`)
    const data = await response.json()
    return { cityName: data.city, ll: `${data.longitude},${data.latitude}` }
}