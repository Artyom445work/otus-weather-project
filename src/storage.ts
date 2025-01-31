export const saveToList = (citiesList: string[]) => {
    localStorage.setItem("weather", JSON.stringify(citiesList))
}

export const loadList = (): string[] => {
    const dataStr = localStorage.getItem("weather")
    return dataStr ? JSON.parse(dataStr) : []
}