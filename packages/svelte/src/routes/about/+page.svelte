<script lang="ts">
  import { Icon, DocumentCheck } from "svelte-hero-icons";
  import { Address } from "$lib/components/scaffold-eth";
  import { createAccount } from "@byteatatime/wagmi-svelte";

  const { address } = $derived.by(createAccount());
</script>

<div class="flex flex-grow flex-col items-center pt-10 font-serif">
  <div class="px-5 text-center">
    <h1 class="mb-4">
      <span class="block font-serif text-6xl font-bold">Gungra.ph</span>
      <span class="mt-2 block font-serif text-2xl">Decentralized Social Blogging Platform</span>
    </h1>
    <div class="flex items-center justify-center space-x-2">
      <p class="my-2 font-medium">Connected Address:</p>
      <Address {address} />
    </div>
  </div>

  <div class="my-8 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-8 text-center">
    <div class=" mb-2 font-serif text-4xl font-bold text-white">Powered by GUN and Ethereum</div>
  </div>

  <div class="mt-16 w-full flex-grow px-8 py-12 font-serif">
    <div class="flex flex-col items-center justify-center gap-12 sm:flex-row">
      <div class="flex max-w-xs flex-col items-center rounded-3xl px-10 py-10 text-center">
        <Icon src={DocumentCheck} class="h-24 w-24 text-blue-500" />
        <h3 class="mt-4 font-serif text-2xl font-bold">Create</h3>
        <p class="mt-2 text-xl">Write and publish your thoughts securely</p>
      </div>
      <div class="flex max-w-xs flex-col items-center rounded-3xl px-10 py-10 text-center">
        <Icon src={DocumentCheck} class="h-24 w-24 text-purple-500" />
        <h3 class="mt-4 font-serif text-2xl font-bold">Share</h3>
        <div class="mt-2 text-xl">Distribute your content across the decentralized network</div>
      </div>
      <div class="flex max-w-xs flex-col items-center rounded-3xl px-10 py-10 text-center">
        <Icon src={DocumentCheck} class="h-24 w-24 text-pink-500" />
        <h3 class="mt-4 font-serif text-2xl font-bold">Connect</h3>
        <p class="mt-2 text-xl">Engage with other writers and readers in a decentralized space</p>
      </div>
    </div>
  </div>
</div>

<div class="card-actions mt-6 justify-center font-serif">
  <a href="/gungraph" class="btn btn-primary btn-lg">
    <Icon src={DocumentCheck} class="mr-2 h-6 w-6" />
    Start Writing
  </a>
</div>

<div class="card mx-auto my-8 max-w-4xl p-6 font-serif">
  <div class="card-body">
    <h2 class="card-title text-primary font-serif text-4xl font-extrabold">What is Gungra.ph?</h2>
    <p class="mt-4 font-serif text-xl">
      Gungra.ph is a decentralized social blogging platform built on GUN and Ethereum. It provides a secure,
      censorship-resistant space for writers to create, share, and engage with content.
    </p>
    <h3 class="text-primary mt-6 font-serif text-3xl font-bold">Key Features</h3>
    <ul class="mt-4 list-inside list-disc font-serif text-xl">
      <li>
        <span class="font-bold">Decentralized Storage:</span> Your content is stored across a distributed network.
      </li>
      <li><span class="font-bold">Ethereum Authentication:</span> Secure login using your Ethereum wallet.</li>
      <li>
        <span class="font-bold">Public and Private Posts:</span> Choose to share your content publicly or keep it private.
      </li>
      <li>
        <span class="font-bold">Content Verification:</span> Optionally verify your content's authenticity on-chain.
      </li>
    </ul>
    <h3 class="text-primary mt-6 font-serif text-3xl font-bold">How It Works</h3>
    <ol class="mt-4 list-inside list-decimal font-serif text-xl">
      <li>Connect your Ethereum wallet</li>
      <li>Create a new post or browse existing content</li>
      <li>Publish your post to the decentralized network</li>
      <li>Share your unique post link with others</li>
    </ol>
  </div>
</div>

<style>
  /* Add any custom styles here if needed */
  h2 {
    background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }

  .gradient-text {
    background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
</style>
