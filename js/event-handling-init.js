
function initEventHandlingAndUI(context){
    context.windowManager().target($('#content'));
    initUI(context.windowManager(), context);

    $('#bttn-character-overview').on('click', e => {
        const survivorList = window.GameContext.survivors();
        /* $('#content').empty().append(GAME_UI.SurvivorSelection(survivorList)); */
        const onSurvSelection = (con, surv) => {
            con.on("click", e => context.windowManager().push( () => GAME_UI.SurvivorOverview(surv) ));
        };
        context.windowManager().set( () => GAME_UI.SurvivorSelection(survivorList, onSurvSelection));

    });
    $('#bttn-missions-overview').on('click', e => {
        context.windowManager().set( () => GAME_UI.MissionControlUI(window.GameContext));
    });

    $("#quick-view-list").append(GAME_UI.SurvivorQuickViewList(context.survivors()));
    context.addChangeListener( () => {
        $("#quick-view-list").html(GAME_UI.SurvivorQuickViewList(context.survivors()));
    });
    $("#bttn-end-round").on("click", event => context.endRound() );
    $("#bttn-inventory-overview").on("click", event => {
        context.windowManager().set( () => GAME_UI.InventoryView(window.GameContext.camp() ));
    });

    $("#bttn-message-overview").on("click", event => {
        context.windowManager().set( () => GAME_UI.UserMessageCenterView(context) );
    });

    context.messageCenter().addChangeListener(event => {
        $("#message-box-info").text( context.messageCenter().getEventCount() );
        if(context.messageCenter().getEventCount() > 0){
            $("#message-box-info").addClass("notify-update").removeClass("no-update");
        }else{
            $("#message-box-info").removeClass("notify-update").addClass("no-update");
        }
    });
    $("#message-box-info").text( context.messageCenter().getEventCount() ).addClass("no-update");

    $("#message-box-info").on("click", event => {
        context.windowManager().set( () => GAME_UI.UserMessageCenterView(context) );
    });

    $("#header-crafting-materials").text(context.craftingHandler().materialCount());
    context.eventDispatcher().subscribe(GameEvents.WEAPON_CRAFTED, /**@param {WeaponCraftEvent} event*/ event => { //TODO: construction and payment have beenn seperated. first pay. after some rounds item.
        $("#header-crafting-materials").text(context.craftingHandler().materialCount() );
    });
    $("#bttn-crafting-overview").on("click", event => {
        context.windowManager().set( () => GAME_UI.CraftingView(context.craftingHandler(), result => context.camp().addToInventory(result)) );
    });
}