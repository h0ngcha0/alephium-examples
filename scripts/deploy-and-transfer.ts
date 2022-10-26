import { Project, web3 } from '@alephium/web3'
import { testAddress, testNodeWallet } from '@alephium/web3-test'

async function main() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const nodeProvider = web3.getCurrentNodeProvider()

  const initialBalance = await nodeProvider.addresses.getAddressesAddressBalance(testAddress)
  console.log("initialBalance", initialBalance)

  const signer = await testNodeWallet()

  await Project.build({ errorOnWarnings: false })

  const shinyTokenContract = Project.contract("ShinyToken")
  const deployResult = await shinyTokenContract.deploy(signer, {
    initialAttoAlphAmount: 10000000000000000000n,
    issueTokenAmount: 10000n
  })
  console.log("Deploy result", deployResult)

  const shinyTokenId = deployResult.contractId

  const transferScript = Project.script("Transfer")
  const transferResult = await transferScript.execute(signer, {
    initialFields: {
      "shinyTokenId": shinyTokenId,
      "to": testAddress,
      "amount": 10n
    }
  })
  console.log("Transfer result", transferResult)

  const balanceAfterTransfer = await nodeProvider.addresses.getAddressesAddressBalance(testAddress)
  console.log("balanceAfterTransfer", balanceAfterTransfer)
}

main()