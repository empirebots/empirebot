module.exports = {
    getEquivalent: str =>
    {
        let possibility = [["Clear", "Rain", "Mist", "Clouds", "Drizzle"]
            , [":sunny:", ":cloud_rain:", ":foggy:", ":cloud:", ":white_sun_rain_cloud:"]];
        if (possibility[0].indexOf(str) !== -1)
        {
            let pos = possibility[0].indexOf(str);
            return possibility[1][pos];
        }
    }
};
