# warframe-data

Data for Warframe, in JSON, scrubbed from the Wikia.

Currently the goal is to get mods, weapons, etc. in json format as VoiD_Glitch (and
Devove and ScruffyRules) already have drops in json format [here](http://destiny.trade/).

I currently do this two ways; getting information via [Falterfire](http://warframe.wikia.com/wiki/User:Falterfire)'s
[Module:Weapons/data](http://warframe.wikia.com/wiki/Module:Weapons/data) lua
script, and then scrubbing the wikia pages manually for other entries.

## Requirements

- node v8, npm 5

## Usage

- `npm run fetch-lua`: Fetches data from the `Module:Weapons/data` script.
  Output should be in `/fetch-lua-data`.
- `npm run export-lua`: Converts said fetched (and possibly edited) json back into the lua format. 
  Output is in `/export-lua/weapon-data.lua`.
  - This requires that you've run `fetch-lua` at least once, obviously.

Manual scrubbing usage is still WIP.
