// import { withIronSessionApiRoute } from "iron-session/next";
import { plaidClient } from "../../lib/plaid";

//  export default withIronSessionApiRoute(exchangePublicToken, sessionOptions);

export default async function exchangePublicToken(req, res) {
  const exchangeResponse = await plaidClient.itemPublicTokenExchange({
    public_token: req.body.public_token,
  });

  // req.session.access_token = exchangeResponse.data.access_token;

  // await req.session.save();
  res.status(200).json({ accessToken: exchangeResponse.data.access_token });
}
