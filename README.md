# 📝 Gungra.ph

Gungra.ph is a decentralized social blogging platform built with GUN.js and Ethereum.

This project is a build with [SE-2Gun](https://github.com/scobru/SE-2Gun) with some modifications to fit the needs of Gungra.ph.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Important Notice](#important-notice)
- [Getting Started](#getting-started)
- [Usage](#usage)

## Overview

Gungra.ph offers a secure and censorship-resistant space for writers to create, share, and engage with content. Leveraging the power of GUN.js for decentralized data storage and Ethereum for authentication, Gungra.ph provides a truly decentralized blogging platform.

## Features

- **Decentralized Storage**: Content is stored across a distributed network.
- **Ethereum Authentication**: Secure login using your Ethereum wallet.
- **Public and Private Posts**: Choose to share your content publicly or keep it private.
- **Content Verification**: Optionally verify your content's authenticity on-chain.
- **User-Friendly Interface**: Intuitive design for easy post creation and management.

## How It Works

1. **Connection**: Users connect with their Ethereum wallet.
2. **Creation**: Writers can create new posts or edit existing ones.
3. **Publishing**: Posts are published to the decentralized network.
4. **Sharing**: Users can share links to their posts.
5. **Interaction**: Readers can access and interact with published content.

## Important Notice

**Attention**: Currently, this GUN.js implementation is not connected to any external relay. Consequently:

- Data is stored only locally in the user's browser.
- Data does not persist across different browser sessions or devices.
- Data sharing between users is limited.
- Clearing your browser cache will result in the loss of all saved data.

It is recommended to use this configuration for development and testing purposes only.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the application with `npm run dev`
4. Open your browser and go to `http://localhost:5173/gungraph`

## Usage

- **Create a new post**: Click on "New Post" and fill in the required fields.
- **Edit a post**: Select an existing post and click "Edit".
- **Delete a post**: Click "Delete" next to the desired post (private posts only).
- **Share a post**: Copy the post link after publishing.

For more detailed usage instructions, refer to the "How to Use Verification" section within the application.
