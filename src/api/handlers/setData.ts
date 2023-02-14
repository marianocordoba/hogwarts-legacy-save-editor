import type { Database } from 'better-sqlite3'
import context from "../lib/context"

export const setData = async (_event: any, data: any): Promise<boolean> => {
  const dbClient: Database = context.get('dbClient')

  if (!dbClient) return false

  console.log(data)

  const getSlotForResource = (item: string): number => {
    return dbClient.prepare(`
      SELECT SlotNumber FROM InventoryDynamic WHERE CharacterID = 'Player0' AND HolderID = 'ResourceInventory' AND ItemID = ?
      UNION ALL SELECT MAX(SlotNumber) FROM InventoryDynamic WHERE CharacterID = 'Player0' AND HolderID = 'ResourceInventory' LIMIT 1;
    `).get(item).SlotNumber
  }

  const getSlotForSanctuary = (item: string): number => {
    return {
      ChompingCabbage_Byproduct: 0,
      Maxima: 1,
      VenomousTentacula_Byproduct: 2,
      Mandrake_Byproduct: 3,
      InvisibilityPotion: 4,
      AMFillPotion: 5,
      AutoDamagePotion: 6,
      Edurus: 7,
    }[item]
  }

  console.log(data)

  dbClient.prepare(`BEGIN TRANSACTION`).run();

  const miscValues = [
    ['Player', 'PlayerFirstName', data.misc.PlayerFirstName],
    ['Player', 'PlayerLastName', data.misc.PlayerLastName],
    ['Player0', 'BaseInventoryCapacity', data.misc.BaseInventoryCapacity],
    ['Player0', 'PerkPoints', data.misc.PerkPoints],
    ['ExperienceManager', 'ExperiencePoints', data.misc.ExperiencePoints],
  ]

  miscValues.forEach(values => {
    dbClient.prepare(`
    INSERT OR REPLACE INTO MiscDataDynamic VALUES (?, ?, ?)
    `).run(...values)
  })

  dbClient.prepare(`
    INSERT OR REPLACE INTO InventoryDynamic VALUES ('Player0', 'HealthPotionStorage', 0, 'WoundCleaning', NULL, ?, 0, 0, 0, DATETIME('now'))
  `).run(data.inventory.health.WoundCleaning)

  const inventoryValues = Object.entries(data.inventory.resources).map(([item, count]) => ([
    getSlotForResource(item), item, count,
  ]))

  inventoryValues.forEach(values => {
    dbClient.prepare(`
        INSERT OR REPLACE INTO InventoryDynamic VALUES ('Player0', 'ResourceInventory', ?, ?, NULL, ?, 0, 0, 0, DATETIME('now'))
    `).run(...values)
  })

  const sanctuaryValues = Object.entries(data.inventory.sanctuary).map(([item, count]) => ([
    getSlotForSanctuary(item), item, count,
  ]))

  sanctuaryValues.forEach(values => {
    dbClient.prepare(`
        INSERT OR REPLACE INTO InventoryDynamic VALUES ('Player0', 'SanctuaryWheel', ?, ?, NULL, ?, 0, 0, 0, DATETIME('now'))
    `).run(...values)
  })

  Object.entries(data.talents).forEach(([talent, unlocked])=> {
    if (unlocked) {
      dbClient.prepare(`
        INSERT OR REPLACE INTO PerkDynamic VALUES (?, 1)
      `).run(talent)
    } else {
      dbClient.prepare(`
        DELETE FROM PerkDynamic WHERE PerkID = ?
      `).run(talent)
    }
  })

  dbClient.prepare(`COMMIT TRANSACTION`).run();

  return true
}
