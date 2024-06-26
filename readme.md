# Onchainads

Onchain Summer Hack Project 2024

### Quick intro about our project:

Shopify hosts over 100,000 online stores and millions of product listings. Store owners traditionally promote their products using Google and Facebook Ads. We're developing a Shopify App Platform to extend this promotional reach to Farcaster clients.

With our project, 'Onchainads,' Shopify store owners can create promotional Farcaster casts directly from Shopify. Each promotional cast is registered on-chain. Store owners set up an on-chain account with Coinbase Smart Wallet and add DEGEN tokens to the ad network contracts to continue distribution to FC users.

Whenever Farcaster users engage with these promoted ads by clicking on them, we track the Click-Through-Rate (CTR) to gather analytics. Based on this engagement data, a fee is calculated and processed through our registered smart contracts on Base.

![table](./shopify_dashboard.png)

### Overview of Architecture

![table](./diagram_architecture.png)

### Contracts addresses on base sepolia testnet

1. DeGen - 0x76160579627CD45Ba88f23E5919C61444AF53D5A
2. Airdrop - 0x868c539269b3Cc51B00b34D3294c25Fc09cCd06c
3. OnChainAd - 0xa5d88f17AB42Cbe9EF68177a815D218c1DE650AD
4. NFTWithAffiliates - 0x2a12e7bcC4662227Ddd28b60627d9dc25598be1A

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
