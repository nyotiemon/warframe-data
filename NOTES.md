# Notes

## Weapons

http://warframe.wikia.com/wiki/Template:WeaponInfoboxU11
http://warframe.wikia.com/wiki/Template:WeaponInfoboxAutomatic

## Mods

http://warframe.wikia.com/wiki/Template:ModBox

## Warframes

- Health and Shields get a 3.0x multiplier at rank 30
- Armor stays the same
- Energy gets +0.5x at rank 30

## Companions

- Kavat health gets a 6.0x health multiplier at rank 30
- Kavat Shields and Kubrow Health + Shields follow the normal 3.0x multiplier

Scrubbing:

`/Wiki/{mod_name|companion_name|weapon_name}?action=raw`
`/Wiki/{warframe_name}/Main?action=raw`
`/Wiki/{warframe_name}/Prime?action=raw`
`/Wiki/{warframe_name}/Abilities?action=raw`

http://warframe.wikia.com/api/v1/Articles/List?category={category}&limit={limit}

Categories:
- Mods
- Weapons
- Warframes
- Sentinel
- Kubrow
- Kavat

- Use offset in `&offset={offset}` to continue through the "pages"
  - Keep going until offset no longer exists
