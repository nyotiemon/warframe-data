json = require "lualib.json"
data = require "wikia-data.weapondata"

file = io.open("./wikia-data/weapon-data.json", "w")
file:write(json.encode(data))
file:close()
