const hre = require("hardhat");

async function main() {

  const ImpactoV7 = await hre.ethers.getContractFactory("ImpactoV7");
  const impactoV7 = await ImpactoV7.deploy();

  await impactoV7.deployed();

  console.log("Impacto deployed to:", impactoV7.address);

  
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
