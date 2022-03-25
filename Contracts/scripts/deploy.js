const hre = require("hardhat");

async function main() {

  const ImpactoV6 = await hre.ethers.getContractFactory("ImpactoV6");
  const impactoV6 = await ImpactoV6.deploy();

  await impactoV6.deployed();

  console.log("Impacto deployed to:", impactoV6.address);

  
  /* let mint = await impactoV6.mint(1);
  await mint.wait();
  console.log("Minted", mint); */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
