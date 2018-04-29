import { EventDispatcher } from "../event";

const eventService = new EventDispatcher();

export const Services = {
    /**@type {EventDispatcher} */
    EventService: eventService
};