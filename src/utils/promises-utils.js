export function chainPromises(promises,initialValue){
  return promises.reduce((lastPromise, fn)=>(
    lastPromise.then(fn)
  ),Promise.resolve(initialValue));
};

export async function resolvePromises(promises){
  const result = [];
  for(const promise of promises)
    result.push(await promise);
  return result;
}
