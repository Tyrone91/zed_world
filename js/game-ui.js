/**
 * 
 * @param {windowManager} windowManager 
 */
function initUI(windowManager){
    const assets = "assets/";
    const images = assets + "images/";
    const jpg = ".jpg";

    const createBackButton = function(text){
        text = text || "Back";
        return $("<button>").text(text).addClass("back-button");
    };

    const createConfirmButton = function(text){
        text = text || "Confirm";
        return $("<button>").text(text).addClass("confirm-button");
    };

    /**
     * 
     * @param {CraftingHandler} craftingHandler 
     */
    const CraftingQueueList = function(craftingHandler){
        const domElement = $("<div>").addClass("crafting-queue-list");
        for(let i = 0; i < craftingHandler.getMaxCraftingCount(); ++i){
            const craftingSlot = $("<div>").addClass("crafting-queue-slot");
            domElement.append(craftingSlot);
            if( i < craftingHandler.getItemInCreationCount() ){
                const element = craftingHandler.getCraftigQueue()[i];
                craftingSlot.addClass("crafting-queue-used-slot");
                craftingSlot.text(element.time + "/" + element.recipe.craftingTime);
            }
        }

        return domElement;
    }

    /**
     * @param {CraftingHandler} craftingHandler
     * @param {CraftingRecipe} recipe 
     */
    const CraftingRecipeEntry = function(craftingHandler, recipe, onSelection = (recipe) => {} ){
        const domElement = $("<div>").addClass("crafting-view-recipe-entry").addClass("clickable");
        const url = images + recipe.icon + jpg;
        domElement.css("background-image", "url("+ url+ ")");
        domElement.css("background-size", "cover");
        domElement.on("click", event => onSelection(recipe) );

        const headLine = $("<div>").addClass("crafting-view-recipe-entry-headline").text(recipe.name);
        const description = $("<div>").addClass("crafting-view-recipe-entry-description").text(recipe.description);
        const cost = $("<div>").addClass("crafting-view-recipe-entry-cost").text(recipe.cost);

        if(craftingHandler.canCreate(recipe)){
            domElement.addClass("crafting-view-recipe-available");
        }
        return domElement.append(headLine, description, cost);
    };
    /**
     * 
     * @param {CraftingHandler} craftingHandler 
     */
    const CraftingView = function(craftingHandler, onSuccessfulCrafting){
        const domElement = $("<div>").addClass("crafting-view");
        domElement.append(CraftingQueueList(craftingHandler));
        const recipeList = $("<div>").addClass("crafting-view-entry-list");
        craftingHandler.getAllRecipes().forEach( recipe => {
            /**@param {CraftingRecipe} recipe*/
            const onSelection = recipe => {
                if(craftingHandler.canCreate(recipe) ){
                    craftingHandler.create(recipe,onSuccessfulCrafting);
                    windowManager.render(); // rerender to update availability
                }
            };
            recipeList.append(CraftingRecipeEntry(craftingHandler ,recipe, onSelection ));
        });
        return domElement.append(recipeList);
    };

    const UserMessageEventConverter = function(source){
        let name = "PLACEHOLDER";
        let description = "SAMPLE_TEXT";
        if(source.name === GameEvents.MISSION_SUCCESSFUL){
            name = "Mission Report: Successful";
            description = "Your survivors did a wonderful job and (most of them) returned.";
        }else if(source.name === GameEvents.MISSION_FAILED){
            name = "Mission Report: Failed";
            description = "After we didn't hear anything from our team, we send a recon party. They returned but only with bad news. Our first team now walks under the dead.";
        }else if(source.name === GameEvents.SURVIVOR_DIED){
            const survivorName = source.event.survivor.name();
            name = "Rest in Peace " + survivorName;
            description = "Even if we all know how short a life can be these days, it is still sad to lose a friend."
            + survivorName + " will not be forgotten. Death by: " + source.event.cirumstances;
        }else if(source.name === GameEvents.LOOT_FOUND){
            name = "We found something";
            description = "Finally we found something useful. Our inventory has the following been added: " + source.event.loot.map(loot => loot.name()).join(", ");
        }
        return { //TODO add somehing like color for different events
            name: name,
            description: description,
            hotlink: "TODO. Link as example to the inventory if the user got a new Item"
        }
    }

    const UserEventMessageCenterEntry = function(source, onRemove = () => {} ){
        const domElement = $("<div>").addClass("message-center-entry");
        const data = UserMessageEventConverter(source);
        const headLine = data.name;
        //TODO add icon to delete message etc.
        const headlineElement = $("<div>");
        headlineElement.append($("<div>").addClass("message-center-entry-headline").text(headLine));
        headlineElement.append($("<button>").text("X").on("click", event => onRemove(source) ));
        domElement.append(headlineElement); 
        domElement.append($("<div>").addClass("message-center-entry-body").text(data.description) );
        domElement.append($("<div>").addClass("message-center-entry-link").text(data.hotlink) );
        return domElement;
    };

    const UserMessageCenterEventList = function(list, onEntryRemove){
        const domElement = $("<div>").addClass("message-center-list");
        list.forEach(event => {
            domElement.append(UserEventMessageCenterEntry(event,onEntryRemove));
        });
        return domElement;
    };

    /**
     * @param {Context} context 
     */
    const UserMessageCenterView = function(context){
        /**
         * @type {MessageCenter} messageCenter
         */
        const messageCenter = context.messageCenter();
        const events = messageCenter.getAllEvents();

        const domElement = $("<div>").addClass("message-center");
        const buttonCommands = $("<div>");
        const bttnClearAll = $("<button>").text("Clear All").on("click", event => {messageCenter.deleteAllEvents(); windowManager.render() } );
        buttonCommands.append(bttnClearAll);
        domElement.append(buttonCommands);
        domElement.append(UserMessageCenterEventList(events, data => {messageCenter.deleteEvent(data);  windowManager.render()} ));
        return domElement;
    };


    const EquipmentPanel = function(equipment, slot, onclick){
        slot = slot || "Undfined";
        onclick  = onclick || ( () => {});
        const domElement = $("<div>").addClass("equipment-panel");
        domElement.append($("<div>").text(slot).addClass("equipment-panel-slot") );
        if(equipment){
            const avatar = $("<img>").attr("src", images + equipment.id() + jpg);
            domElement.append(avatar).addClass("equipment-panel-icon");
        }else{
            domElement.append($("<div>").addClass("equipment-panel-nothing").text("None").addClass("equipment-panel-icon") );
        }
        return domElement.on("click", e => onclick(equipment) );
    };

    /**
     * 
     * @param {[Loot.Equipment]} source 
     */
    const EquipmentInventoryTable = function(source, onSelection = (()=>{}) ){
        const table = $("<table>");

        const head = $("<tr>");
        const createHead = (...args) => args.forEach( arg => { head.append($("<th>").text(arg) ) });
        createHead("Name", "Damge", "Speed" , "Range", "Accuracy", "Silence", "Health", "Armor", "Awareness");

        table.append(head);
        /**
         * @param {Stats} entry 
         */
        const createRow = function(item, name, entry){
            const tr = $("<tr>").append($("<td>").text(name) );
            const td = (value) => $("<td>").text(value.toString() );
            const damage = entry.damage();
            const speed = entry.speed();
            const optimalRange = entry.optimalRange();
            const accuracy = entry.accuracy();

            const silence = entry.silence();
            const health = entry.health();
            const armor = entry.armor();
            const awareness = entry.awareness();
            //TODO: add item icon
        
            const glue = (...args) =>args.forEach(value => tr.append(td(value) ));
            glue(damage,speed,optimalRange,accuracy,silence,health,armor,awareness);
            return tr.on("click", event => onSelection(item) );
        };
        source.forEach( item => table.append(createRow(item, item.name(), item.stats()) ));
        return table;
    };

    const InventoryView = function(inventoryHolder, onSelection = (() =>{})){ //TODO: only first iteration of the inventory view
        const domElement = $("<div>").addClass("inventory-view");
        const equipmentList = [];
        inventoryHolder.inventory().forEach( item => {
            if(item instanceof Loot.Equipment){
                equipmentList.push(item);
            }else if(item instanceof Loot.Resource){

            }
        });

        return domElement.append(EquipmentInventoryTable(equipmentList, onSelection));
    };

    /** @callback EquipPanelOnSelection @param {string} slot */
    /** @param {EquipPanelOnSelection} onSelection */
    const EquipPanel = function(target, onSelection = ( (slot) => {}) ){
        const headElement = $("<div>").append(EquipmentPanel(target.headEquipment(), "Head" ));
        const bodyElement = $("<div>").append(EquipmentPanel(target.bodyEquipment(), "Body" ));
        const legElement = $("<div>").append(EquipmentPanel(target.legEquipment(), "Legs" ));
        const glovesElement = $("<div>").append(EquipmentPanel(target.glovesEquipment(), "Gloves" ));
        const mainWeaponElement = $("<div>").append(EquipmentPanel(target.mainWeapon(), "Weapon" ));

        headElement.on("click", event => onSelection(Loot.Equipment.Type.HEAD_ARMOR) );
        bodyElement.on("click", event => onSelection(Loot.Equipment.Type.BODY_ARMOR) );
        legElement.on("click", event => onSelection(Loot.Equipment.Type.LEG_ARMOR) );
        glovesElement.on("click", event => onSelection(Loot.Equipment.Type.GLOVES) );
        mainWeaponElement.on("click", event => onSelection(Loot.Equipment.Type.WEAPON) );

        const row = function(){
            return $("<div>").addClass("equip-panel-row");
        };
        const domElement = $("<div>").addClass("equip-panel")
        .append( row().append(headElement) )
        .append( row().append(glovesElement).append(bodyElement).append(mainWeaponElement) )
        .append( row().append(legElement) );
        return domElement; 
    };

    const BuildingMenu = function(){

    };

    const SurvivorAvatarNameTag = function(survivor){
        const name = survivor.name();
        const avatar = images + survivor.avatar();
        const img = $("<img>").attr("src", avatar);
        return $("<div>").append(img).append($("<div>").text(name) ).addClass("survivor-avatar-name-tag");
    };

    const MissionQuickView = function(mission, onclick){
        onclick = onclick || ( () => {} );

        const locationName = mission.environment().name();
        const survivorContainer = $("<div>").addClass("mission-quick-view-survivor-container");
        const locationContainer = $("<div>").addClass("mission-quick-view-location-container");
        locationContainer.append(locationName).append($("<img>").attr("src", images + locationName + jpg));
        mission.getParty().forEach(surv => {
            survivorContainer.append(SurvivorAvatarNameTag(surv) );
        });
        return $("<div>")
            .append(locationContainer)
            .append(survivorContainer)
            .addClass("mission-quick-view")
            .on("click", event => onclick(mission) );
    };

    const MissionQuickViewList = function(missions, onclick){
        const list = $("<div>").addClass("mission-quick-view-list");
        missions.forEach( mission => list.append(MissionQuickView(mission, onclick) ));
        return list;
    };

    

    const SurvivorQuickView = function(survivor, onclick){
        onclick = onclick || ( () => {});
        const name = survivor.name();
        const id = survivor.id();
        const state = survivor.currentState();

        const domElement = $("<div>").addClass("survivor-quick-view");
        const avatar = $("<img>").attr("src", "assets/images/" + survivor.avatar());
        const nameCon = $("<div>").text(name).addClass("survivor-quick-view-name");
        const stateCon = $("<div>")
            .text(state)
            .addClass("survivor-quick-view-state")
            .addClass("survivor-quick-view-state-"+ state.toLowerCase());

        return domElement
        .append(avatar)
        .append(nameCon)
        .append(stateCon)
        .on("click", e => onclick(survivor) );
    };
    
    const SurvivorQuickViewList = function(survivors){
        const list = $("<div>").addClass("survivor-quick-view-list");
        const openInfoPanel = function(survivor){
            windowManager.set( () => SurvivorOverview(survivor) );
        };
        survivors.forEach( sur => {
            list.append(SurvivorQuickView(sur, openInfoPanel));
        });
        return list;
    };

    const ResourceView = function(source, domElement){
        source.resourcesAsArray().forEach(res => {
            const name = res.name();
            const value = res.value();
            const element = $('<div>');
            res.addOnChangeListener( (resource, newValue, oldValue) => {
                element.text(newValue);
            });
            element.text(value);
            $(domElement).append(element);
        });
    };

    /**
     * Component showing stats
     * @param  {Stats} source [description]
     * @return {[type]}        [description]
     */
    const StatsOverview = function(source){
        const health = source.health();
        const damage = source.damage();
        const accuracy = source.accuracy();
        const optimalRange = source.optimalRange();
        const speed = source.speed();
        const armor = source.armor();
        const silence = source.silence();
        const awareness = source.awareness();

        const domElement = $("<div>");
        const helper = function(name, value){
            const entryElement = $("<div>");
            const nameElement = $("<div>");
            nameElement.text(name);
            const valueElement = $("<div>");
            valueElement.text(value.toString());

            entryElement.append(nameElement);
            entryElement.append(valueElement);
            entryElement.addClass("stats-entry");
            domElement.append(entryElement);
        }
        helper("Health", health);
        helper("Damage", damage);
        helper("Accuracy", accuracy);
        helper("Range", optimalRange);
        helper("Speed", speed);
        helper("Armor", armor);
        helper("Silence", silence);
        helper("Awareness", awareness);
        domElement.addClass("stats-overview");
        return domElement;
    };

    /**
     * [description]
     * @param  {Stats} left  [description]
     * @param  {Stats} right [description]
     * @return {[type]}       [description]
     */
    const StatsCompare = function(left,right,headerLeft, headerRight){
        const health = left.health() - right.health();
        //const damage = left.damage() - right;
        const accuracy = left.accuracy() - right.accuracy();
        //const optimalRange = left.optimalRange();
        const speed = left.speed() - right.speed();
        const armor = left.armor() - right.armor();
        const silence = left.silence() - right.silence();
        const awareness = left.awareness() - right.awareness();

        const domElement = $("<div>");
        const helper = function(name, left, right, operator, comperator){
            operator = operator || ((o1,o2) => o1 - o2);
            comperator = comperator || ((o1,o2) => o1 - o2);
            const entryElement = $("<div>");
            const nameElement = $("<div>");
            nameElement.text(name);
            const leftElement = $("<div>");
            const rightElement = $("<div>");
            leftElement.text(left.toString());
            rightElement.text(right.toString());

            const result = operator(left, right);
            const resultElement = $("<div>");
            resultElement.text(result <= 0 ? "+" + (-result) : "-" + result);
            if(comperator(left,right) === 0){
                leftElement.addClass("stats-compare-even");
                rightElement.addClass("stats-compare-even");
                resultElement.addClass("stats-compare-even");
            }else if(comperator(left,right) < 0){
                leftElement.addClass("stats-compare-worse");
                rightElement.addClass("stats-compare-better");
                resultElement.addClass("stats-compare-better");
            }else{
                leftElement.addClass("stats-compare-better");
                rightElement.addClass("stats-compare-worse");
                resultElement.addClass("stats-compare-worse");
            }

            entryElement.append(nameElement);
            entryElement.append(leftElement);
            entryElement.append(rightElement);
            entryElement.append(resultElement);
            entryElement.addClass("stats-entry");
            entryElement.addClass("stats-compare-entry");
            domElement.append(entryElement);
        }
        const avgHelper = (a,b) => a.average() - b.average();
        const spanHelper = (a,b) => a.span() - b.span();
        helper("Health", left.health(), right.health());
        helper("Damage", left.damage(), right.damage(), avgHelper, avgHelper);
        helper("Accuracy", left.accuracy(), right.accuracy());
        helper("Range", left.optimalRange(), right.optimalRange(), spanHelper, spanHelper);
        helper("Speed", left.speed(), right.speed());
        helper("Armor", left.armor(), right.armor());
        helper("Silence", left.silence(), right.silence());
        helper("Awareness", left.awareness(), right.awareness());
        domElement.addClass("stats-compare");
        domElement.addClass("stats-overview");
        if(headerLeft || headerRight){
            const lhElement = $("<div>");
            lhElement.text(headerLeft);
            const rhElement = $("<div>");
            rhElement.text(headerRight);
            const resultHeaderElement = $("<div>");
            resultHeaderElement.text("=");
            const headerEntry = $("<div>");
            const empty = $("<div>");
            headerEntry.append(empty);
            headerEntry.append(lhElement);
            headerEntry.append(rhElement);
            headerEntry.append(resultHeaderElement);
            headerEntry.addClass('stats-compare-header');
            domElement.prepend(headerEntry);
        }
        return domElement;
    };

    const SurvivorInfoPanel = function(survivor){
        const domElement = $("<div>").addClass("survivor-info-panel");
        const avatar = $("<img>").attr("src", images + survivor.avatar() );
        const nameCon = $("<div>").text(survivor.name()).addClass("survivor-info-panel-name");
        const stats = StatsOverview(survivor.stats());
        return domElement.append(avatar).append(nameCon).append(stats);
    };

    const SurvivorOverview = function(survivor){
        const domElement = $("<div>").addClass("survivor-overview");
        const infoPanel = SurvivorInfoPanel(survivor);
        /**@param {String} slot */
        const onSelection = (slot) => {
            //TODO: For know only open weapons
            if(slot === Loot.Equipment.Type.WEAPON){
                windowManager.push( () => InventoryView( window.GameContext.camp(), item => {
                    const old = survivor.mainWeapon();
                    if(old){ 
                        old.unequipFrom(survivor);
                        window.GameContext.camp().addToInventory(old);
                    }
                    item.equipTo(survivor);
                    const index = window.GameContext.camp().inventory().indexOf(item);
                    window.GameContext.camp().inventory().splice(index,1);
                    windowManager.pop();
                    //TODO: make it better please....
                }));
            }
        };
        const equipmentPanel = EquipPanel(survivor,onSelection);
        const controlPanel = $("<nav>").addClass("vertical-align");

        const bttnSendAway = $("<button>").text("Send Away");
        const bttnRename = $("<button>").text("Rename");
        const bttnStartTraining = $("<button>").text("Start Training");
        const bttnStripWeapon = $("<button>").text("Unequip All");
        bttnStripWeapon.on("click", event => {
            const helper = function(item){
                if(item){
                    item.unequipFrom(survivor);
                    window.GameContext.camp().addToInventory(item); //TODO: The unequip function has a bug. If you pass null to the survivor equiptment function it will just treat it as getter. Need seperate function.
                }
            };
            helper(survivor.mainWeapon());
            helper(survivor.headEquipment());
            helper(survivor.legEquipment());
            helper(survivor.glovesEquipment());
            helper(survivor.bodyEquipment());
            windowManager.render();
        });

        controlPanel.append(bttnRename).append(bttnStartTraining).append(bttnStripWeapon).append(bttnSendAway);

        return domElement.append(infoPanel).append(equipmentPanel).append(controlPanel);
    };

    const SurvivorSelection = function(survivors, applyToEntry){
        const domElement = $("<div>");
        applyToEntry = applyToEntry || (() => {});
        domElement.addClass("survivors-selection-panel");
        survivors.forEach( s => {
            const containerElement = $("<div>").addClass('survivor-panel');
            const survivorPicture = $('<div>').addClass('survivor-picture');
            const survivorInfo = $('<div>').addClass('survivor-info').append($('<p>').text(s.name())).append($('<p>').text("State: " + s.currentState() ));
            const personalPanel = $('<div>').addClass('personal-panel').append(survivorPicture).append(survivorInfo);

            containerElement
            .append(personalPanel)
            .append(StatsOverview(s.stats() ));
            applyToEntry(containerElement, s);
            domElement.append(containerElement)

        });
        return domElement;
    };

    const LocationAttributesOverview = function(attributes){
        const factory = function(name, value){
            const domElement = $('<div>').addClass("location-attributes-entry");
            return domElement
            .append($('<div>').text(name + ":").addClass("location-attributes-name"))
            .append($('<div>').text(value).addClass("location-attributes-value"));
        }

        const visibilityReduction = attributes.visibilityReduction();
        const maxZombies = attributes.maxZombieCount();
        const minZombies = attributes.minZombieCount();
        const startingRange = attributes.startingRange();
        const encounterChance = attributes.encounterChance();
        const reinforcementChance = attributes.reinforcementChance();
        const commonChance = attributes.commonItemDropChance();
        const rareChance = attributes.rareItemDropChance();
        const extraordinaryChacne = attributes.extraordinaryItemDropChance();

        const domElement = $('<div>').addClass("location-attributes-panel");
        domElement
        .append(factory("Visibility Reduction", visibilityReduction))
        .append(factory("Max. Zeds", maxZombies))
        .append(factory("Min. Zeds", minZombies))
        .append(factory("Range", startingRange))
        .append(factory("Encounter %", encounterChance))
        .append(factory("Reinforcement %", reinforcementChance))
        .append(factory("Common Loot %", commonChance))
        .append(factory("Rare Loot %", rareChance))
        .append(factory("Extraordinary Loot %", extraordinaryChacne));
        return domElement;
    };
    /**
     * Creates a mission selection UI
     * @param  {WorldMap} worldmap [description]
     * @return {DOMElement}          [description]
     */
    const LocationSelection = function(worldmap, applyToEntry){
        applyToEntry = applyToEntry || (() => {});

        const domElement = $('<div>').addClass('location-selection-panel');
        const findWidthAndHeight = function(pairs){
            let width = 0;
            let height = 0;
            pairs.forEach(pair => {
                const position = pair.first;
                width = position.x > width ? position.x : width;
                height = position.y > height ? position.y : height;
            });
            return {
                width: width,
                height: height
            };
        };
        const findLocationAt = function(pivot, point){
            return point.x === pivot.x && point.y === pivot.y
        };
        //TODO: this is just a first implementation of the missionMap
        //TODO: for now I just do a grid-based thing
        const pairs = worldmap.locationPairs();
        const res = findWidthAndHeight(pairs);
        const width = res.width;
        const height = res.height;

        for(let y = 0; y <= height; ++y){
            const row = $('<div>').addClass("location-selection-row");
            for(let x = 0; x <= width; ++x){
                const pair = pairs.find(pair => findLocationAt(Util.pointOf(x,y), pair.first ) ); //FIXME: I know, I know it is really hard to get worse performance than that, but for know with max 9 Location or so I don't care right now
                if(pair){
                    const element = $('<div>').text(pair.second.name()).addClass("location-entry");
                    applyToEntry(pair.second, element);
                    row.append(element);
                }else{
                    row.append($('<div>').addClass("location-entry").addClass("empty") );
                }
            }
            domElement.append(row);
        }
        return domElement;
    };

    const SurvivorMissionSelection = function(location, survivors, onMissionStart){
        const domElement = $('<div>').addClass("survivor-mission-selection-panel");
        const availableContainer = $('<div>');
        const selectedContainer = $('<div>');
        const locationContainer = $('<div>');
        const availableSurvivor = survivors.slice(0);
        const selectedSurvivor = [];
        const renderSelections = function(left, right){
            availableContainer.html(SurvivorSelection(availableSurvivor, left));
            selectedContainer.html(SurvivorSelection(selectedSurvivor, right));
            const attributes = new LocationAttributes();
            const size = selectedSurvivor.length;
            const maxTeam = 3;
            const silenceModi = size > maxTeam ? (1 + ((size-maxTeam) * 0.05)) : 1
            attributes.encounterChance(silenceModi); //TODO: Just ui output not affecting anything
            attributes.apply(location.attributes());

            const confirmButtn = createConfirmButton();
            confirmButtn.on("click", event => {
                onMissionStart(selectedSurvivor, location);
            });
            const backBttn = createBackButton();
            backBttn.on("click", e => {
                windowManager.pop();
            });
            locationContainer.html(LocationAttributesOverview(attributes))
            .append(confirmButtn)
            .append(backBttn);
        }

        const leftToRight = function(element, survivor){
            element.on("click", event => {
                selectedSurvivor.push(survivor);
                const index = availableSurvivor.indexOf(survivor);
                availableSurvivor.splice(index, 1);
                renderSelections(leftToRight, rightToLeft);
            });
        };
        const rightToLeft = function(element, survivor){
            element.on("click", event => {
                availableSurvivor.push(survivor);
                const index = selectedSurvivor.indexOf(survivor);
                selectedSurvivor.splice(index, 1);
                renderSelections(leftToRight, rightToLeft);
            });
        };
        renderSelections(leftToRight, rightToLeft);
        return domElement
        .append($('<div>').text("Available Survivor").append(availableContainer))
        .append($('<div>').text("Selected Survivor").append(selectedContainer))
        .append($('<div>').text(location.name()).append(locationContainer));
    };

    const MissionSelection = function(context, onMissionStart){
        const domElement = $('<div>').addClass("mission-selection-panel");
        let selectedLocation = null;
        const switchToSurvivorSelection = function(){
            const content = SurvivorMissionSelection(selectedLocation, context.survivors().filter(s => s.currentState() === Survivor.State.Idle),onMissionStart );
            //domElement.html(content);
            windowManager.push( () => content);
        };

        const leftPanel = $('<div>');
        const rightPanel = $('<div>').addClass('mission-selection-active-location-attributes');
        const worldMap = context.missionMap();
        const confirmButton = $('<button>');
        confirmButton.addClass('confirm-button').text("Confirm");

        const showAttributesOf = function(location){
            if(!location){
                rightPanel.empty();
                rightPanel.text("Nothing selected");
                return;
            }
            rightPanel.html(LocationAttributesOverview(location.attributes()));
            rightPanel.prepend(
                $('<div>')
                .text(location.name())
                .addClass('mission-selection-location-name')
            )
            .append(confirmButton.on("click", event => switchToSurvivorSelection()) );
        };
        const applyToEntry = (location, element) => {
            element.on("mouseover", event => {
                showAttributesOf(location);
            });
            element.on("click", event => {
                selectedLocation = location;
                $(domElement).find('.mission-selection-active-selection')
                .removeClass('mission-selection-active-selection');
                element.addClass('mission-selection-active-selection');
            });
            element.on("mouseout", evnet => {
                showAttributesOf(selectedLocation);
            });
        };
        showAttributesOf(selectedLocation);
        domElement
        .append(leftPanel.append(LocationSelection(worldMap, applyToEntry)))
        .append(rightPanel);
        return domElement;
    };

    const LootItemView = function(loot, onselect){
        onselect = onselect || (() => {});
        const domElement = $("<div>").addClass("loot-item-view");
        
        domElement.append($("<div>").addClass("loot-item-icon").append($("<img>").attr("src", "assets/images/" + loot.name() + ".jpg") ) );
        domElement.append($("<div>").addClass("loot-item-name").text(loot.name() ));
        return domElement.on("click", event => onselect(loot) );
    };

    /**
     * 
     * @param {Mission} mission 
     */
    const MissionReportView = function(mission){
        const report = mission.getMissionReport();
        const domElement = $('<div>');
        const headLine = $('<div>');
        const groupList = $('<div>').addClass("mission-report-group-list");
        mission.getParty().forEach( surv => groupList.append($('<div>').text(surv.name()).addClass(surv.isDead() ? "mission-report-dead" : "mission-report-alive") )); //maybe make a link to him??

        headLine
        .addClass("mission-report-headline")
        .append(groupList)
        .append($('<div>').text("Zombies killd: " + report.getEnemiesKilled() ))
        .append($('<div>').text("Mission: " + report.getMissionState() ));

        const lootList = $("<div>")
        .addClass("mission-report-loot-list");
        report.getLoot().forEach( loot => lootList.append(LootItemView(loot)) );

        const summary = $("<div>").addClass("mission-report-summary");
        const createDetailEntry = function(action){
            const entry = $("<tr>").addClass("mission-report-detail-entry");

           

            entry.append($("<td>").text(action.attacker) );
            entry.append($("<td>").text(action.target) );
            entry.append($("<td>").text(action.missed) );
            entry.append($("<td>").text(action.range) );
            entry.append($("<td>").text(action.optimalRange) );
            entry.append($("<td>").text(action.hitchance.toFixed(0)) );
            return entry;
        };
        const createRoundSummary = function(round){
            const roundHeadline = $("<div>").addClass("mission-report-round-headline");
            const details = $("<table>").hide();
            const tableHeader = $("<tr>");
            tableHeader.append($("<th>").text("Survivor") );
            tableHeader.append($("<th>").text("Target") );
            tableHeader.append($("<th>").text("Missed") );
            tableHeader.append($("<th>").text("Distance"));
            tableHeader.append($("<th>").text("Survivor Optimal Distance") );
            tableHeader.append($("<th>").text("Hitchance") );
            details.append(tableHeader);
            round.actions.forEach( action => details.append(createDetailEntry(action)) );
            let visible = false;
            const toggleBttn = $("<button>").text("+").on("click", e => {
                if(visible){
                    details.hide(0);
                    toggleBttn.text("+");
                }else{
                    details.show(0);
                    toggleBttn.text("-");
                }
                visible = !visible;
            });
            roundHeadline.append(toggleBttn).append("Distance: " + round.distance).append("Zombies: " + round.enemies.length);
            return $("<div>").append(roundHeadline).append(details);
        };
        report.getRoundDetails().forEach(round => summary.append(createRoundSummary(round) ));
        //const detailList = $('<div>').addClass("mission-report-detail-list");
        
    
        return domElement.append(headLine).append(lootList).append(summary);
    };

    const MissionControlUI = function(context){
        const self = this;
        const domElement = $("<div>").addClass("mission-control");
        const bttnBar = $("<nav>");
        const bttnNewMission = $("<button>").text("New Mission");
        const bttnPreparedMission = $("<button>").text("Prepared Missions");
        const bttnMissionHistory = $("<button>").text("History");
        bttnBar.append(bttnNewMission).append(bttnPreparedMission).append(bttnMissionHistory);
        const newMissionSelection = function(){
            return MissionSelection(context, (survivors, location) =>{
                context.createMission(survivors, location);
                windowManager.set( () => MissionControlUI(context));
            });
        };
        bttnNewMission.on("click", e => windowManager.push( () => newMissionSelection() ));
        const preparedSelected = function(){
            const render = function(){
                const domElement = $("<div>");
                domElement.append(createBackButton().on("click", e => windowManager.pop() ));
                domElement.append(MissionQuickViewList(context.getPreparedMissions() ));
                return domElement;
            };
            windowManager.push( () => render() );
        };
        bttnPreparedMission.on("click", e => preparedSelected() );
        const missionHistorySelect = function(){
            const openReport = function(mission){
                const domElement = $("<div>");
                domElement.append(createBackButton().on("click", e => windowManager.pop() ));
                domElement.append(MissionReportView(mission));
                windowManager.push( () => domElement );    
            };
            const render = function(){
                const domElement = $("<div>");
                domElement.append(createBackButton().on("click", e => windowManager.pop() ));
                domElement.append(MissionQuickViewList(context.getMissionHistory(),openReport ));
                return domElement;
            };
            windowManager.push( () => render() );
        };
        bttnMissionHistory.on("click", e => missionHistorySelect() );
        return domElement.append(bttnBar);
    };

    window.GAME_UI = {
        ResourceView : ResourceView,
        StatsOverview : StatsOverview,
        StatsCompare: StatsCompare,
        SurvivorSelection: SurvivorSelection,
        LocationSelection: LocationSelection,
        MissionSelection: MissionSelection,
        MissionReportView: MissionReportView,
        SurvivorQuickViewList: SurvivorQuickViewList,
        MissionControlUI: MissionControlUI,
        SurvivorOverview: SurvivorOverview,
        InventoryView: InventoryView,
        UserMessageCenterView: UserMessageCenterView,
        CraftingView: CraftingView
    };
    window.addEventListener("load", event => {

    });
}
