import { plaidClient } from "../../lib/plaid";

export default async function handler(req, res) {
  try {
    const transferCreateResponse = await plaidClient.transferCreate({
      access_token: req.body.accessToken,
      account_id: req.body.accountId,
      authorization_id: req.body.authorizationId,
      // Note: This data will be collected from our application
      description: "Debit",
    });

    const response = await plaidClient.accountsBalanceGet({
      access_token: req.body.accessToken,
    });
    const accounts = response.data.accounts;

    res.status(200).json({
      transferCreateData: transferCreateResponse.data,
      accounts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
