import { HydrationBoundary } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import NFTCard from '../../components/NFTCard';
import Providers from './Providers';

const query = gql`{
  tokens(first: 5) {
    id
    owner {
      id
    }
    tokenID
    tokenURI
  }
}`;
const url = 'https://api.studio.thegraph.com/query/102813/onlyroasts/version/latest';

interface Token {
  id: string;
  owner: { id: string };
  tokenID: string;
  tokenURI: string;
}

interface DataResponse {
  tokens: Token[];
}

export default async function HomePage() {
  const data: DataResponse = await request(url, query);

  return (
    <Providers>
      <HydrationBoundary>
        <Data data={data} />
      </HydrationBoundary>
    </Providers>
  );
}

function Data({ data }: { data: DataResponse }) {
  console.log(data.tokens); // Log the tokens to check their values

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data.tokens.map((token) => (
        <NFTCard
          key={token.id}
          id={token.id}
          owner={token.owner.id}
          tokenID={token.tokenID}
          tokenURI={token.tokenURI}
        />
      ))}
    </div>
  );
}
