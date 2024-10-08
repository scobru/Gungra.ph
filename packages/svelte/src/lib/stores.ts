import type { IGunInstance } from "gun";
import { writable, type Writable } from "svelte/store";
import "gun-eth";
import { watchAccount } from '@wagmi/core';
import Gun from 'gun';

export const currentUser = writable(null);
export const gun = writable(null) as unknown as Writable<IGunInstance<any>>;
gun.set(
    new Gun({
        peers: ["http://localhost:3000/gun"],
        localStorage: false,
    }),
);


