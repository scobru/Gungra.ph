<script>
  import { onMount, afterUpdate } from "svelte";
  import { gun } from "$lib/stores";
  import { get } from "svelte/store";
  import DOMPurify from "dompurify";
  import { createAccount } from "@byteatatime/wagmi-svelte";
  import { notification } from "$lib/utils/scaffold-eth/notification";
  import { goto } from "$app/navigation";

  let messages = [];
  let newMessage = "";
  let username = "";
  let gunInstance;
  let user;
  let userPair;
  let isNicknameSet = false;
  let nicknameError = "";
  let isInitialized = false;

  const { address, chain, isConnected } = $derived.by(createAccount());

  onMount(async () => {
    gunInstance = get(gun);
    if (!gunInstance) {
      console.error("Istanza Gun non inizializzata");
      notification.error("Errore di inizializzazione. Riprova più tardi.");
      return;
    }

    user = gunInstance.user().recall({ sessionStorage: true });
    isInitialized = true;
  });

  $effect(() => {
    if (isInitialized && isConnected) {
      initializeChat();
    }
  });

  async function initializeChat() {
    const pairString = sessionStorage.getItem("pair");
    if (pairString) {
      userPair = JSON.parse(pairString);
      await loadUserNickname();
      loadMessages();
    } else {
      notification.warning("Chiave pubblica mancante. Effettua l'autenticazione.");
      goto("/auth");
    }
  }

  async function loadUserNickname() {
    return new Promise(resolve => {
      gunInstance
        .get("userProfiles")
        .get(address)
        .once(profile => {
          if (profile && profile.nickname) {
            username = profile.nickname;
            isNicknameSet = true;
          } else {
            username = address;
            isNicknameSet = false;
          }
          resolve();
        });
    });
  }

  async function setNickname() {
    if (!isConnected) {
      notification.error("Connetti il tuo wallet per impostare un nickname.");
      return;
    }

    if (!userPair) {
      notification.error("Chiave pubblica mancante. Effettua l'autenticazione.");
      return;
    }

    if (!username.trim()) {
      nicknameError = "Inserisci un nickname valido";
      return;
    }

    const publicKey = userPair.pub;

    if (!publicKey) {
      nicknameError = "Public key non trovata";
      notification.error("Errore nel recupero della chiave pubblica. Riprova più tardi.");
      return;
    }

    const userProfile = {
      nickname: username,
      address: address,
      publicKey: publicKey,
    };

    // Salva il profilo utente nel nodo dell'utente
    user.get("profile").put(userProfile);

    // Salva il nickname e la chiave pubblica nel nodo pubblico
    gunInstance
      .get("userProfiles")
      .get(address)
      .put(
        {
          nickname: username,
          publicKey: publicKey,
        },
        ack => {
          if (ack.err) {
            nicknameError = "Errore nel salvare il nickname";
            notification.error("Impossibile salvare il nickname. Riprova più tardi.");
          } else {
            isNicknameSet = true;
            nicknameError = "";
            notification.success("Nickname impostato con successo!");
          }
        },
      );
  }

  function loadMessages() {
    gunInstance
      .get("chat")
      .map()
      .on((data, id) => {
        console.log("Messaggio ricevuto:", data, id);
        if (data) {
          const sanitizedMessage = {
            id,
            text: DOMPurify.sanitize(data.text),
            username: DOMPurify.sanitize(data.username),
            timestamp: data.timestamp,
          };

          messages = messages.filter(m => m.id !== id);
          messages = [...messages, sanitizedMessage];
          messages.sort((a, b) => a.timestamp - b.timestamp);
        }
        messages = [...messages]; // Forza l'aggiornamento della reattività
      });
  }

  async function sendMessage() {
    if (!isConnected) {
      notification.error("Connetti il tuo wallet per inviare messaggi.");
      return;
    }

    if (!newMessage.trim()) {
      notification.warning("Inserisci un messaggio valido.");
      return;
    }

    const message = {
      text: newMessage,
      username: username || address,
      timestamp: Date.now(),
    };

    await gunInstance.get("chat").set(message);
    newMessage = "";
    console.log("Messaggio inviato:", message);
  }

  afterUpdate(() => {
    console.log("Stato aggiornato:", isConnected);
  });
</script>

<main class="container mx-auto max-w-3xl p-4">
  <h1 class="mb-4 text-center font-serif text-3xl">Chat Pubblica</h1>

  {#if isConnected}
    {#if !isNicknameSet}
      <div class="mb-4">
        <input
          type="text"
          bind:value={username}
          placeholder="Il tuo nickname (opzionale)"
          class="input input-bordered w-full"
        />
        <button on:click={setNickname} class="btn btn-secondary mt-2">Imposta Nickname</button>
        {#if nicknameError}
          <p class="mt-2 text-red-500">{nicknameError}</p>
        {/if}
      </div>
    {:else}
      <p class="mb-4">Benvenuto, {username}!</p>
    {/if}

    <div class="mb-4 h-96 overflow-y-auto border p-4">
      {#each messages as message (message.id)}
        <div class="mb-2">
          <span class="font-bold">{message.username}:</span>
          <span>{message.text}</span>
          <span class="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleString()}
          </span>
        </div>
      {/each}
    </div>

    <div class="flex">
      <input
        type="text"
        bind:value={newMessage}
        placeholder="Scrivi un messaggio..."
        class="input input-bordered flex-grow"
      />
      <button on:click={sendMessage} class="btn btn-primary ml-2">Invia</button>
    </div>
  {:else}
    <p class="text-center">Connetti il tuo wallet per partecipare alla chat.</p>
  {/if}
</main>
