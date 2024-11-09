import { plaidClient } from "../../lib/plaid";

export default async function handler(req, res) {
  console.log(req.body.accessToken, "req.body.accessToken");
  try {
    const response = await plaidClient.accountsBalanceGet({
      access_token: req.body.accessToken,
    });

    const accounts = response.data.accounts;

    res.status(200).json({
      accounts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
