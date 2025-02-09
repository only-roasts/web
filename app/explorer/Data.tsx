'use client'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'
const query = gql`{
  tokens(first: 5) {
    id
    owner {
      id
    }
    tokenID
    tokenURI
  }
}`
const url = 'https://api.studio.thegraph.com/query/102813/onlyroasts/version/latest'
export default function Data() {
  // the data is already pre-fetched on the server and immediately available here,
  // without an additional network call
  const { data } = useQuery({
    queryKey: ['data'],
    async queryFn() {
      return await request(url, query)
    }
  })
  return <div>{JSON.stringify(data ?? {})}</div>
}