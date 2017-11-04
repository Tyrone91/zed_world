function initUI(windowManager){
    const BuildingMenu = function(){

    }

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
                const pair = pairs.find(pair => findLocationAt(Util.pointOf(x,y), pair.first ) ); //FIXME: I know, I knwo it is really hard to get worse performance than that, but for know with max 9 Location or so I don't care right now
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

            const confirmButtn = $("<button>").addClass("confirm-button").text("Confirm");
            confirmButtn.on("click", event => {
                onMissionStart(selectedSurvivor, location);
            });
            const backBttn = $("<button>").addClass("confirm-button").text("Back");
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
    }

    window.GAME_UI = {
        ResourceView : ResourceView,
        StatsOverview : StatsOverview,
        StatsCompare: StatsCompare,
        SurvivorSelection: SurvivorSelection,
        LocationSelection: LocationSelection,
        MissionSelection: MissionSelection,
        MissionReportView: MissionReportView
    };
    window.addEventListener("load", event => {

    });
}
