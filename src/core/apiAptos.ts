import { Network, Provider, HexString } from "aptos";

interface NFTData {
    creatorAddress: string | undefined,
    collectionName: string | undefined,
    tokenName: string | undefined,
    amount: number | undefined
}

export const fetchNftList = async (address: string): Promise<NFTData[]> => {
    // Replace this with the actual implementation
    console.log(`Fetching NFTs for address: ${address}`);
    try {
        let ownNft: NFTData[] = [];

        const provider = new Provider(Network.TESTNET);

        const nftArr = (await provider.getOwnedTokens(new HexString(address))).current_token_ownerships_v2;

        for (let i = 0; i < nftArr.length; i++) {
            ownNft.push({
                creatorAddress: nftArr[i].owner_address,
                collectionName: nftArr[i].current_token_data?.current_collection?.collection_name,
                tokenName: nftArr[i].current_token_data?.token_name,
                amount: nftArr[i].amount
            })
        }

        return ownNft;

    } catch (error) {
        return [];
    }
};

export const fetchNftBalance = async (address: string): Promise<number> => {
    // Replace this with the actual implementation
    console.log(`Fetching NFT balance for address: ${address}`);

    let amount: number = 0;

    const provider = new Provider(Network.TESTNET);

    const nftArr = (await provider.getOwnedTokens(new HexString(address))).current_token_ownerships_v2;

    for (let i = 0; i < nftArr.length; i++) {
        amount += nftArr[i].amount;
    }

    return amount;
};
