import React from 'react';
import { Card, CardContent, CardTitle, CardDescription } from './ui/card';

interface NFTCardProps {
  id: string;
  owner: string;
  tokenID: string;
  tokenURI: string;
}

const NFTCard: React.FC<NFTCardProps> = ({ id, owner, tokenID, tokenURI }) => {
  return (
    <Card className="m-4 p-4 border border-black border-opacity-50 bg-white rounded-lg">
      <CardContent>
        <CardTitle>{`Token ID: ${tokenID}`}</CardTitle>
        <CardDescription>{`Owner: ${owner}`}</CardDescription>
        <img src={tokenURI} alt={`NFT ${tokenID}`} className="w-full h-auto" />
      </CardContent>
    </Card>
  );
};

export default NFTCard;
