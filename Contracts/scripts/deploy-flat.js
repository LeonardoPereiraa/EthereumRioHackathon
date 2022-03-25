const hre = require("hardhat");


async function main() {

  const ImpactoV6flat = await hre.ethers.getContractFactory("ImpactoV6flat");
  const impactoV6 = await ImpactoV6flat.deploy();

  await impactoV6.deployed();
  
  console.log("Impacto deployed to:", ImpactoV6flat.address);


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
