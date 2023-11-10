import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tell Apollo we will take care of all
    read(existing = [], { args, cache }) {
      // if items are in the cache, we return them
      // or we can return false, and we gonna hit the server
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // if
      //  there are items
      //  AND there aren't eoungh items to satisfy how many were requested
      //  AND we are on the last page
      // Then just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // we dont have any items, we must go to the network to fetch them
        return false;
      }

      if (items.length) {
        console.log(
          `Tere are ${items.length} items in the cache! Gonna send them to apollo`
        );
        return items;
      }

      return false; // fallback to network
    },
    merge(existing, incoming, { args }) {
      // after going to the network we marge the products to our cache
      console.log(`Merging items from the network ${incoming.length}`);

      const { skip, first } = args;
      const merged = existing ? existing.slice(0) : [];

      // we put the records in their corresponding place
      for (let i = skip; i < skip + incoming.length; i++) {
        merged[i] = incoming[i - skip];
      }

      console.log(incoming);
      return merged;
    },
  };
}
