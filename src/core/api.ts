import { Aptos, AptosConfig, Network, NetworkToNetworkName } from "@aptos-labs/ts-sdk";
import {
  KeylessAccount,
} from "@aptos-labs/ts-sdk";

const APTOS_NETWORK: Network = NetworkToNetworkName[import.meta.env.VITE_APTOS_NETWORK];

const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

interface UserGridState {
  address: string;
  new_grid_state: number[];
}

export const fetchAptBalance = async (address: string): Promise<number> => {
  // Replace this with the actual implementation
  const accountBalance = await aptos.getAccountResource({
    accountAddress: address,
    resourceType: import.meta.env.VITE_COIN_STORE_APTOS_COIN,
  });
  const balance = Number(accountBalance.coin.value) / 100_000_000;
  console.log(`Fetching APT balance for address: ${address}`);
  return balance; // Mock balance
};

export const fetchGuiBalance = async (address: string): Promise<number> => {
  try {
    // Replace this with the actual implementation
    const accountBalance = await aptos.getAccountResource({
      accountAddress: address,
      resourceType: import.meta.env.VITE_COIN_STORE_EXGUI_COIN,
    });
    const balance = Number(accountBalance.coin.value) / 1_000_000;
    console.log(`Fetching $GUI balance for address: ${address}`);
    return balance; // Mock balance
  } catch (error) {
    return 0;
  }
};

export const fetchTotalDigs = async (address: string): Promise<number> => {
  const [result]: any = await aptos.view<[string]>({
    payload: {
      function: `${import.meta.env.VITE_TREASUREHUNT_SC_ADDRESS}::treasurehunt::game_state`,
      functionArguments: []
    }
  })
  let user_index = result.users_list.indexOf(address);
  return Number(result.users_state[user_index].dig);
};

export const fetchTotalRewards = async (address: string): Promise<number> => {
  const [result]: any = await aptos.view<[string]>({
    payload: {
      function: `${import.meta.env.VITE_TREASUREHUNT_SC_ADDRESS}::treasurehunt::game_state`,
      functionArguments: []
    }
  })
  let user_index = result.users_list.indexOf(address);
  return Number(result.users_state[user_index].earned_pool);
};

export const fetchGameState = async (address: string | undefined): Promise<any> => {
  const [result]: any = await aptos.view<[string]>({
    payload: {
      function: `${import.meta.env.VITE_TREASUREHUNT_SC_ADDRESS}::treasurehunt::game_state_with_time`,
      functionArguments: []
    }
  })

  let newOtherUserState: UserGridState[] = [];


  for (let i in result.game_state.users_list) {
    if (result.game_state.users_list[i] !== address && (result.now_time_microsecond - result.game_state.users_state[i].update_time) / 100000 < 9) {
      newOtherUserState.push({
        address: result.game_state.users_list[i],
        new_grid_state: result.game_state.users_state[i].old_digs.map((dig: string) => parseInt(dig)),
      })
    }
  }

  return newOtherUserState;
}

export const optInDirectTransfer = async (activeAccount: KeylessAccount): Promise<boolean> => {
  try {
    const transaction = await aptos.transaction.build.simple({
      sender: activeAccount.accountAddress,
      data: {
        function: `${import.meta.env.VITE_APTOS_TOKEN_ADDRESS}::token::opt_in_direct_transfer`,
        functionArguments: [true]
      }
    });

    const senderAuthenticator = aptos.transaction.sign({
      signer: activeAccount,
      transaction
    });

    const submittedTransaction = await aptos.transaction.submit.simple({
      transaction,
      senderAuthenticator
    })

    await aptos.waitForTransaction({ transactionHash: submittedTransaction.hash });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
