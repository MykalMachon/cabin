export async function get() {
  return {
    body: JSON.stringify({ message: `API is okay` }),
  };
}