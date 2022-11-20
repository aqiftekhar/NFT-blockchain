import { FunctionComponent } from "react";
import { NFTModel } from "../../../../Model/NFT";
import NFTitem from "../Item";

interface NFTListProps {
  NFT?: NFTModel[];
}
const NFTList: FunctionComponent<NFTListProps> = ({ NFT }) => {
  return (
    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
      {NFT?.map((nft) => (
        <div
          key={nft.id}
          className="flex flex-col rounded-lg shadow-lg overflow-hidden"
        >
          <NFTitem item={nft} />
        </div>
      ))}
    </div>
  );
};

export default NFTList;
