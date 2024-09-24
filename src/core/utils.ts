export const collapseAddress = (address: string | undefined): string => {
  if (address) return `${address.slice(0, 6)}...${address.slice(-4)}`;
  else return "";
};
export const collapseAddressWithSmall = (address: string | undefined): string => {
  if (address) return `${address.slice(0, 4)}...${address.slice(-2)}`;
  else return "";
};