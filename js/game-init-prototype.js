//TODO put into closure
/**
 * 
 * @param {CraftingHandler} craftingHandler 
 */
function initCraftingRecipes(craftingHandler){
    const make = function(name, desc, icon, time, cost){
        return {
            cost: cost,
            craftingTime: time, 
            name: name, 
            description: desc,
            iconName: icon
        };
    };
    const instantM4 = new CraftingRecipe( () => WeaponGenerator.randomM4(),  make("M4 Cheat instant", "Only for debug stuff", "M4", 0, 0) );
    const oneRoundAndFreeM4 = new CraftingRecipe( () => WeaponGenerator.randomM4(),  make("M4 4free 1Round", "Only for debug stuff", "M4", 1, 0) );
    const m4 = new CraftingRecipe( () => WeaponGenerator.randomM4(),  make("M4 Blueprint", "The M4 Assault Rifle is good stuff", "M4", 2, 500) );
    const ak47 = new CraftingRecipe( () => WeaponGenerator.randomAk47(), make("AK47 Blueprint", "", "", 1, 400) );
    const huntingRifle = new CraftingRecipe( () => WeaponGenerator.randomHuntingRifle(), make("Hunting Rifle Blueprint", "", "", 5, 750) );

    craftingHandler.addRecipe(m4, ak47, huntingRifle,instantM4,oneRoundAndFreeM4);
}

/**
 * @param {Context} context 
 */
function initLootTable(context){
    const weaponTable = new LootTable();
    weaponTable.addLoot( () => WeaponGenerator.randomAk47(1), 10, "AK47");
    weaponTable.addLoot( () => WeaponGenerator.randomM4(1), 10, "M4");
    weaponTable.addLoot( () => WeaponGenerator.randomHuntingRifle(1), 5, "Hunting-Rifle");
    console.log("Weapon table");
    weaponTable.dropChanceList().forEach( entry => console.log(entry.toString()));

    const weaponCache = new LootTable();
    weaponCache.addLoot( () => [weaponTable.roll(), weaponTable.roll()], 100, "Small Cache");
    weaponCache.addLoot( () => [weaponTable.roll(), weaponTable.roll(),  weaponTable.roll()], 50, "Medium Cache");
    weaponCache.addLoot( () => [weaponTable.roll(), weaponTable.roll(),  weaponTable.roll(),  weaponTable.roll()], 20, "Large Cache");
    console.log("cache table");
    weaponCache.dropChanceList().forEach( entry => console.log(entry.toString()));

    const debugTable = new LootTable();
    debugTable.addLoot( () => WeaponGenerator.randomAk47(1), 20, "AK47");
    debugTable.addLoot( () => WeaponGenerator.randomM4(1), 15, "M4");
    debugTable.addLoot( () => WeaponGenerator.randomHuntingRifle(1), 12, "Hunting-Rifle");
    debugTable.addLoot( () => new Loot.Wood(100), 25, "Huge Wood");
    debugTable.addLoot( () => new Loot.Stone(100), 25, "Huge Stone");
    debugTable.addLoot( () => new Loot.Food(100), 25, "Huge Food");
    debugTable.addLoot( () => weaponCache.roll() , 10, "Weapon-Cache");

    context.commonLootTable(debugTable);
    context.extraordinaryLootTable(debugTable);
    context.rareLootTable(debugTable);
}

function initMissionMap(map){
    const smallCity = new Location("small_city", "Small City");
    smallCity.attributes()
    .visibilityReduction(20)
    .minZombieCount(25)
    .maxZombieCount(75)
    .commonItemDropChance(90)
    .rareItemDropChance(50)
    .extraordinaryItemDropChance(10)
    .startingRange(75)
    .reinforcementChance(33)
    .encounterChance(60);

    const farms = new Location("farms", "Farms");
    farms.attributes()
    .visibilityReduction(0)
    .minZombieCount(5)
    .maxZombieCount(15)
    .commonItemDropChance(40)
    .rareItemDropChance(5)
    .extraordinaryItemDropChance(1)
    .startingRange(100)
    .reinforcementChance(5)
    .encounterChance(33);

    const plains = new Location("plain", "Plains");
    plains.attributes()
    .visibilityReduction(0)
    .minZombieCount(5)
    .maxZombieCount(15)
    .commonItemDropChance(10)
    .rareItemDropChance(1)
    .extraordinaryItemDropChance(1)
    .startingRange(150)
    .reinforcementChance(5)
    .encounterChance(10);

    const overrunEvac = new Location("overrun_evec", "Abonded Evac-Point");
    overrunEvac.attributes()
    .visibilityReduction(30)
    .minZombieCount(25)
    .maxZombieCount(150)
    .commonItemDropChance(100)
    .rareItemDropChance(60)
    .extraordinaryItemDropChance(20)
    .startingRange(80)
    .reinforcementChance(45)
    .encounterChance(75);


    map.addLocation(Util.pointOf(0,0),plains );
    map.addLocation(Util.pointOf(1,0),plains );
    map.addLocation(Util.pointOf(2,0),plains );

    map.addLocation(Util.pointOf(0,1),plains );
    map.addLocation(Util.pointOf(1,1),smallCity );
    map.addLocation(Util.pointOf(2,1),plains );

    map.addLocation(Util.pointOf(0,2),overrunEvac );
    map.addLocation(Util.pointOf(1,2),farms );
    map.addLocation(Util.pointOf(2,2),farms );
}
/**
 * 
 * @param {Context} context 
 */
function initDebugUtils(context){
    GLOBAL_EVENT_LOGGER = new EventLogger(context.eventDispatcher());
}

function getContextOptions(){
    return {
        initialCraftingQueueLength: 5
    };
}

function initDebugWorld(){
    const tyrone = new Survivor("survivor1", "Tyrone");
    tyrone.avatar("debug_survivor_avatar.jpg");
    tyrone.stats().health(100).damage(Range.of(25,50)).optimalRange(Range.of(15,50)).speed(4).accuracy(65);
    window.GameContext
    .addSurvivor(tyrone);
    initMissionMap(window.GameContext.missionMap());
    /**@type {Context} */
    const context = window.GameContext;
    initLootTable(context);
    initDebugUtils(context)
    initCraftingRecipes(context.craftingHandler());
    window.addEventListener("load", event => {
        initEventHandlingAndUI(context);
    });
}
    