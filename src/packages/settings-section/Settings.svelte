<script>
</script>

<main class="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6 lg:mt-32">
  <div class="mt-10 sm:mt-0">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Settings</h3>
          <p class="mt-1 text-sm text-gray-600" />
        </div>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <form action="#" method="POST">
          <div class="shadow overflow-hidden sm:rounded-md">
            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                  <label for="ipfs" class="block text-sm font-medium text-gray-700"
                    >IPFS Gateway</label
                  >
                  <select
                    id="ipfs"
                    name="ipfs"
                    autocomplete="ipfs-name"
                    class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="https://cloudflare-ipfs.com/ipfs/">Cloudflare</option>
                    <option value="https://ipfs.io/ipfs/">IPFS.io</option>
                    <option value="https://ipfs.infura.io/ipfs/">Infura</option>
                    <option value="https://gateway.pinata.cloud/ipfs/">Pinata</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >Save</button
              >
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</main>
