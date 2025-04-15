const conf = (() => {
   const api_url = process.env.NEXT_PUBLIC_API_URL;
   const session = process.env.NEXT_PUBLIC_SESSION_NAME;
   if (api_url === "") {
      throw new Error("no api url");
   }

   const c = {
      api_url,
      session,
   };

   Object.freeze(c);
   return c;
})();

export default conf;
