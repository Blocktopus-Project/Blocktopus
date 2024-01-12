import { sleep } from "@util/sleep.ts";
import type { ServerError } from "@core/error.ts";

interface EventInfo<T> {
  kind: string;
  data: T;
}

type EventHandler<T> = (event: T) => Promise<void>;
type EventPoller<T> = () => Promise<T>;
export type ErrorHandler = (error: ServerError) => Promise<void>;

class Queue<T> {
  #inner: T[] = [];

  add(item: T) {
    this.#inner.push(item);
  }

  takeQueue(): T[] {
    const r = this.#inner;
    this.#inner = [];
    return r;
  }
}

export class EventLoop<Event> {
  #eventPollers: Map<number, CallableFunction> = new Map();
  #eventQueue: Queue<EventInfo<Event>> = new Queue();
  #eventHandlers: Map<string, EventHandler<Event>> = new Map();
  #errorHandler: ErrorHandler | null = null;
  #abortSignal: AbortSignal;

  /** Max Time Between Tick */
  #mtbt: number;

  constructor(abortSignal: AbortSignal, mtbt: number) {
    this.#abortSignal = abortSignal;
    this.#mtbt = mtbt;
  }

  setErrorHandler(handler: ErrorHandler) {
    this.#errorHandler = handler;
  }

  setEventHandler(eventKind: string, handler: EventHandler<Event>) {
    this.#eventHandlers.set(eventKind, handler);
  }

  removeEventHandler(eventKind: string) {
    this.#eventHandlers.delete(eventKind);
  }

  setEventPoller(eventKind: string, id: number, poller: EventPoller<Event>) {
    const pollfn = async () => {
      while (!this.#abortSignal.aborted && this.#eventPollers.has(id)) {
        const v = await poller().catch(this.#errorHandler);
        if (!v) continue;

        this.#eventQueue.add({ kind: eventKind, data: v });
      }
    };

    this.#eventPollers.set(id, pollfn);
  }

  removeEventPoller(id: number) {
    this.#eventPollers.delete(id);
  }

  async startLoop() {
    let lastTick = performance.now();
    while (!this.#abortSignal.aborted) {
      await this.#processEvents();

      const currentTick = performance.now();
      const timeBetweenTicks = currentTick - lastTick;

      await sleep(this.#mtbt - timeBetweenTicks);

      lastTick = performance.now();
    }
  }

  async #processEvents() {
    const promises = [];
    const queue = this.#eventQueue.takeQueue();
    for (let i = 0; i < queue.length; i++) {
      const evt = queue[i];

      const handler = this.#eventHandlers.get(evt.kind);
      if (!handler) continue;

      promises.push(handler(evt.data).catch(this.#errorHandler));
    }

    await Promise.all(promises);
  }
}
