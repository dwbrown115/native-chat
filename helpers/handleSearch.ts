import algoliasearch from "algoliasearch";

export default function handleSearch(
  query: string,
  indexName: string
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const searchKey = process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_KEY || "";
    const appId = process.env.EXPO_PUBLIC_ALGOLIA_APP_ID || "";
    // const client = algoliasearch(appId, searchKey);
    //console.log("client", client);
    //const index = client.initIndex(indexName);
    //console.log("index", index);
    try {
      const client = algoliasearch(appId, searchKey);
      const index = client.initIndex(indexName);

      index.search(query).then(async function (responses) {
        resolve(responses.hits);
        // const resultsArray = await responses.hits;
        // return resultsArray;
        // console.log(responses.hits);
        // return responses.hits;
        // console.log(resultsArray);
        // console.log(responses.hits)
      });
    } catch (e) {
      reject(e);
      // return e;
      // console.log(e)
    }
  });
}
