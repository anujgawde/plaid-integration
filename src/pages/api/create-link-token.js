import { plaidClient } from "../../lib/plaid";

export default async function handler(req, res) {
  const tokenResponse = await plaidClient.linkTokenCreate({
    // transfer: true,
    user: { client_user_id: process.env.PLAID_CLIENT_ID },
    client_name: "Finnessey",
    language: "en",
    // Products would also include 'transfer' when not using sandbox.
    products: ["auth"],
    country_codes: ["US"],
    redirect_uri: process.env.REDIRECT_URI,
  });

  return res.json(tokenResponse.data);
}
