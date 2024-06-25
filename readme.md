### Quick intro about our project:

Shopify hosts over 100,000 online stores and millions of product listings. Store owners traditionally promote their products using Google and Facebook Ads. We're developing a Shopify App Platform to extend this promotional reach to Farcaster clients.

With our project, 'Onchainads,' Shopify store owners can create promotional Farcaster casts directly from Shopify. Each promotional cast is registered on-chain. Store owners set up an on-chain account with Coinbase Smart Wallet and add DEGEN tokens to the ad network contracts to continue distribution to FC users. 

Whenever Farcaster users engage with these promoted ads by clicking on them, we track the Click-Through-Rate (CTR) to gather analytics. Based on this engagement data, a fee is calculated and processed through our registered smart contracts on Base.

### Overview of Architecture

![table](./diagram_architecture.png)


### Running Application

1. Install Shopify Command Lines

https://shopify.dev/docs/api/shopify-cli

2. Create a partner account on Shopify

https://www.shopify.com/partners?shpxid=4b9babc3-1E88-438C-AA61-E6CDD1646858

3. Install Cloudflare locally

4. Run Cloudflare tunner locally

cloudflared tunnel --url http://localhost:3000

5. Run Shopify app platform locally with tunner flag

shopify app dev --tunnel-url [_tunner_url_on_port_3000_]

