<script lang="ts">
  import { setNativeCurrencyPrice } from "$lib/runes/global.svelte";
  import { createNativeCurrencyPrice } from "$lib/runes/nativeCurrencyPrice.svelte";
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  import { reconnect, getAccount } from "@wagmi/core";
  import { wagmiConfig } from "$lib/wagmi";
  import { untrack } from "svelte";
  import { createDarkMode } from "$lib/runes/darkMode.svelte";
  import { modal } from "$lib/modal";
  import { derived } from "svelte/store";

  const price = createNativeCurrencyPrice();

  import { createAccount } from "@byteatatime/wagmi-svelte";
  const { address, chain, isConnected } = $derived.by(createAccount());
  const connected = $derived(isConnected);

  $effect(() => {
    untrack(() => {
      reconnect(wagmiConfig);
    });
  });

  $effect(() => {
    if (!connected) {
      if (sessionStorage.getItem("pair")) {
        sessionStorage.removeItem("pair");
      }
    }
  });

  const { isDarkMode } = createDarkMode();

  $effect(() => {
    modal.setThemeMode(isDarkMode ? "dark" : "light");
  });
</script>

<div class="flex min-h-screen flex-col">
  <Header />

  <main class="relative flex flex-1 flex-col">
    <slot />
  </main>

  <Footer />
</div>
