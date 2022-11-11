import { EventsDict, GameEvent } from "./GameEvent";

export function addEvent(events: EventsDict, event: GameEvent): EventsDict {
  return {
    ...events,
    [event.order]: event,
  };
}
