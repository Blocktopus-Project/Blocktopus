import { sleep } from "@/util/sleep.ts";

interface EventInfo<T, K extends string = string> {
  eventKind: K;
  eventData: T
}

type EventHandler<T, K extends string> = (event: EventInfo<T, K>) => Promise<void>;
type EventPoller<T, K extends string> = () => Promise<EventInfo<T, K>>;

export class EventLoop<Event, PollKind extends string = string, EventKind extends string = string> {
  #eventPoller: Set<EventPoller<Event, EventKind>>;
  #eventQueue: EventInfo<Event, EventKind>[];
  #eventHandlers: Map<EventKind, EventHandler<Event, EventKind>>;

  /** Max Time Between Tick */
  #mtbt: number;

  constructor(mtbt: number) {
    this.#eventPoller = new Set();
    this.#eventQueue = [];
    this.#eventHandlers = new Map();
    this.#mtbt = mtbt;
  }

  setEventHandler(eventKind: EventKind, handler: EventHandler<Event, EventKind>) {
    this.#eventHandlers.set(eventKind, handler);
  }

  removeEventHandler(eventKind: EventKind) {
    this.#eventHandlers.delete(eventKind);
  }

  setEventPoller(poller: EventPoller<Event, EventKind>) {
    this.#eventPoller.add(poller);
  }

  removeEventPoller(poller: EventPoller<Event, EventKind>) {
    this.#eventPoller.delete(poller);
  }

  async startLoop(abortSignal: AbortSignal) {
    let isAborted = false;
    abortSignal.onabort = () => isAborted = true;

    let lastTick = performance.now();
    while (!isAborted) {
      await this.#poll();
      await this.#processEvents();

      const currentTick = performance.now();
      const timeBetweenTicks = currentTick - lastTick;

      await sleep(this.#mtbt - timeBetweenTicks);

      lastTick = performance.now();
    }
  }

  async #poll() {
    const promises = [];
    for (const pollFn of this.#eventPoller.values()) {
      promises.push(pollFn());
    }

    this.#eventQueue = await Promise.all(promises);
  }

  async #processEvents() {
    const promises = [];

    const length = this.#eventQueue.length;
    const handlerKeys = [...this.#eventHandlers.keys()];

    for (let i = 0; i < length; i++) {
      const evt = this.#eventQueue[i];
      if (!handlerKeys.includes(evt.eventKind)) {
        return;
      }

      const handler = this.#eventHandlers.get(evt.eventKind)!;
      promises.push(handler(evt));
    }

    await Promise.all(promises);
    this.#eventQueue = [];
  }
}