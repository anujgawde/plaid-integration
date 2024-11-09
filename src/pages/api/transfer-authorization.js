import { plaidClient } from "../../lib/plaid";

export default async function handler(req, res) {
  try {
    const accountsResponse = await plaidClient.accountsGet({
      access_token: req.body.accessToken,
    });

    const accountId = accountsResponse.data.accounts[0].account_id;
    console.log(req.body.amount);
    const transferAuthorizationCreateResponse =
      await plaidClient.transferAuthorizationCreate({
        access_token: req.body.accessToken,
        account_id: accountId,
        type: "debit",
        network: "ach",
        amount: req.body.amount,
        network: "same-day-ach",
        ach_class: "web",
        // Note: This data will be collected from our application
        user: {
          legal_name: "John Smith",
          phone_number: "+14155550011",
          email_address: "foobar@email.com",
          address: null,
        },
      });

    const itemResponse = await plaidClient.itemGet({
      access_token: req.body.accessToken,
    });

    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: itemResponse.data.item.institution_id,
      country_codes: ["us"],
      options: {
        include_optional_metadata: true,
      },
    });

    res.status(200).json({
      transferAuthData: transferAuthorizationCreateResponse.data,
      accountId,
      institution: institutionResponse.data.institution,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
