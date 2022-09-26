const { ethers } = require("hardhat")
const { getNamedAccounts } = require("hardhat")

const mintAndList = async () => {
    const { deployer } = await getNamedAccounts()
    const nftMarketplace = await ethers.getContract("NftMarketplace", deployer)
    const basicNft = await ethers.getContract("BasicNft", deployer)
    console.log("minting...")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId
    console.log("approving NFT...")
    const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId)
    await approvalTx.wait(1)
    console.log("Listing NFT...")
    const tx = await nftMarketplace.listItem(basicNft.address, tokenId)
    await tx.wait(1)
}

mintAndList()
    .then(() => {
        process.exit(0)
    })
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })
