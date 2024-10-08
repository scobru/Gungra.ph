<script lang="ts">
  import { onMount } from "svelte";
  import { wagmiConfig } from "$lib/wagmi";
  import { getAccount } from "@wagmi/core";
  import { currentUser, gun } from "$lib/stores";
  import { get } from "svelte/store";
  import { notification } from "$lib/utils/scaffold-eth/notification";
  import type { IGunInstance } from "gun/types";
  import type { IGunUserInstance } from "gun/types";
  import Gun from "gun";
  import "gun-eth";
  import { writable, derived } from "svelte/store";

  let isLoading = writable(false);

  let user: IGunUserInstance = {
    recall: (options: { sessionStorage: boolean }, callback: (ack: any) => Promise<void>) => {},
    is: { alias: null },
    on: (event: string, callback: () => Promise<void>) => {},
    create: (alias: any, pass: any, callback: (ack: any) => Promise<void>) => {},
    auth: (alias: any, pass: any, callback: (ack: any) => Promise<void>) => {},
    leave: () => {},
  };

  let errorMessage = "";
  let account: any = null;
  let userPair: ArrayLike<unknown> | { [s: string]: unknown } | null = null;
  let signature: null = null;

  const MESSAGE_TO_SIGN = "Accesso a GunDB con Ethereum";

  $: isOpen = $currentUser === null;

  let gunInstance: IGunInstance<any> | null = get(gun);

  onMount(() => {
    isLoading.set(false);
  });

  Gun.on("opt", function (ctx) {
    if (ctx.once) {
      return;
    }
    ctx.on("out", function (msg) {
      var to = this.to;
      // Adds headers for put
      msg.headers = {
        token: "test",
      };
      to.next(msg); // pass to next middleware
    });
  });
  onMount(() => {
    gunInstance = get(gun);

    if (gunInstance) {
      user = gunInstance?.user();
    } else {
      console.error("Istanza di Gun non inizializzata correttamente");
    }
    account = getAccount(wagmiConfig);

    gunInstance?.setToken("test");

    user.recall({ sessionStorage: true }, async (ack: { err: any }) => {
      if (ack.err) {
        console.error("Errore nel recupero della sessione:", ack.err);
      } else if (user.is) {
        currentUser.set(user.is.alias);
        await loadUserData();
      }
    });

    user.on("auth", async () => {
      console.log("Utente autenticato:", user.is.alias);
      currentUser.set(user.is.alias);
      await loadUserData();
    });
  });

  async function loadUserData() {
    console.log("Loading user data...");
    currentUser.subscribe(value => currentUser.set(value));
    const gunInstance = get(gun); // Aggiunta di un fallback per evitare null

    if (currentUser) {
      userPair = await gunInstance?.getAndDecryptPair(account.address, signature);
      console.log("User Pair:", userPair);
    }
  }

  async function registra() {
    console.log("Registrazione in corso...");
    errorMessage = "";
    const gunInstance = get(gun) || {}; // Aggiunta di un fallback per evitare null
    console.log("gunInstance", gunInstance);

    account = getAccount(wagmiConfig);
    console.log("account", account);

    user = gunInstance.user();
    console.log("user", user);

    try {
      if (!account.address) {
        errorMessage = "Please connect your Ethereum wallet";
        return;
      }

      signature = await gunInstance.createSignature(MESSAGE_TO_SIGN);
      if (!signature) {
        errorMessage = "Errore durante la firma del messaggio";
        return;
      }
      console.log("signature", signature);

      await gunInstance.createAndStoreEncryptedPair(account.address, signature);
      console.log("Pair creata e memorizzata");
      user.create(account.address, signature, async (ack: { err: string }) => {
        if (ack.err) {
          errorMessage = "Errore durante la registrazione: " + ack.err;
        } else {
          alert("Registrazione completata! Ora puoi accedere.");
          isLoading.set(false);
          await loadUserData();
          currentUser.set(user.is.alias);
        }
      });
    } catch (error) {
      errorMessage = "Errore durante la registrazione: " + error.message;
    }
  }

  async function accedi() {
    account = getAccount(wagmiConfig);

    if (!account.address) {
      notification.error("Nessun account Ethereum connesso");
      isLoading.set(false);
      return;
    }
    console.log("Accesso in corso...");
    errorMessage = "";
    const gunInstance = get(gun) || {}; // Aggiunta di un fallback per evitare null
    user = gunInstance.user();

    try {
      account = getAccount(wagmiConfig);
      if (!account.address) {
        errorMessage = "Nessun account Ethereum connesso";
        return;
      }

      signature = await gunInstance.createSignature(MESSAGE_TO_SIGN);
      if (!signature) {
        errorMessage = "Errore durante la firma del messaggio";
        return;
      }

      const pair = await gunInstance.getAndDecryptPair(account.address, signature);
      console.log("Pair:", pair);
      if (!pair) {
        errorMessage = "Errore nel recupero del pair dell'utente";
        return;
      }

      user.auth(pair, async (ack: { err: string }) => {
        console.log("Risposta di autenticazione:", ack);
        if (ack.err) {
          errorMessage = "Errore di accesso: " + ack.err;
        } else {
          console.log("Accesso riuscito");
          currentUser.set(user.is.alias);
          await loadUserData();
        }
        isLoading.set(false);
      });
    } catch (error) {
      errorMessage = "Errore durante l'accesso: " + error.message;
      isLoading.set(false);
    }
  }

  function esci() {
    user.leave();
    currentUser.set(null);
    userPair = null;
    errorMessage = "";
    sessionStorage.removeItem("pair");
  }

  function chiudiModale() {
    isOpen = false;
  }
</script>

<div class="modal" class:modal-open={isOpen}>
  <div class="modal-box">
    <h3 class="text-lg font-bold">Autenticazione</h3>

    {#if get(isLoading)}
      <div class="mt-4 flex items-center justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else}
      {#if errorMessage}
        <div class="alert alert-error mt-4">{errorMessage}</div>
      {/if}
      {#if $currentUser === null}
        <div class="mt-4 flex justify-center space-x-4">
          <button class="btn btn-primary" on:click={registra}><i class="fas fa-user-plus"></i> Sign In</button>
          <button class="btn btn-secondary" on:click={accedi}><i class="fas fa-sign-in-alt"></i> Login</button>
        </div>
      {:else}
        <div class="bg-base-100 mb-4 break-all rounded px-8 pb-8 pt-6 text-center shadow-md">
          <h2 class="mb-4 text-2xl font-semibold">Benvenuto, {$currentUser}!</h2>

          {#if userPair && Object.keys(userPair).length > 0}
            <div class="my-5 items-center">
              <ul class="mx-auto w-2/4 text-left">
                {#each Object.entries(userPair) as [key, value]}
                  <li class="mb-2">
                    <strong>{key}:</strong> <span class="text-base-content">{JSON.stringify(value, null, 2)}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          <button class="btn btn-warning" on:click={esci}><i class="fas fa-sign-out-alt"></i> Esci</button>
          <button class="btn btn-warning" on:click={accedi}><i class="fas fa-eye"></i> View Pair</button>
        </div>
      {/if}
    {/if}

    <div class="modal-action">
      <button class="btn" on:click={chiudiModale}>Chiudi</button>
    </div>
  </div>
</div>
