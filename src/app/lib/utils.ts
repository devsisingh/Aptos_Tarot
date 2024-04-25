export const collapseAddress = (address: string): string => {
  return `${address.slice(0, 4)}..${address.slice(-3)}`;
};
