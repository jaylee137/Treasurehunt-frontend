// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Aptos, AptosConfig, Network, NetworkToNetworkName } from "@aptos-labs/ts-sdk";

export const LocalStorageKeys = {
  keylessAccounts: "@aptos-connect/keyless-accounts",
};

const APTOS_NETWORK: Network = NetworkToNetworkName[import.meta.env.VITE_APTOS_NETWORK] || Network.TESTNET;

export const devnetClient = new Aptos(
  new AptosConfig({ network: APTOS_NETWORK })
);

/// FIXME: Put your client id here
export const GOOGLE_CLIENT_ID = "249840305329-k0ltpbkuc7ks2419i4sbi8v9d0ug6gn6.apps.googleusercontent.com";