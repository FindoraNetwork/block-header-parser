import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-abi-exporter"
import "hardhat-deploy"
import "hardhat-deploy-ethers"
import "hardhat-gas-reporter"
import "hardhat-contract-sizer"
import "hardhat-diamond-abi"
import "@nomiclabs/hardhat-ganache"
import "./tasks/parse_header"
import "./tasks/handle_header_line"


const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    hardhat:
    {
      accounts: [
        {
          privateKey: "0xb501fc5879f214ee8be2832e43955ac0f19e20d1f7e33436d6746ac889dc043d",
          balance: "100000000000000000000000000",
        },
      ],
      chainId: 2152,
      mining: {
        auto: true,
        interval: 3000,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: ["0xb501fc5879f214ee8be2832e43955ac0f19e20d1f7e33436d6746ac889dc043d"],
      chainId: 2152,
      timeout: 3000,
    },
    mainnet: {
      url: "https://prod-mainnet.prod.findora.org:8545",
      accounts: ["0x854075f30c85e2358e8376774df470a451f50227c1eedb0ea119498d7f072958"],
      chainId: 2152,
      timeout: 16000,
    }
  },
  mocha: { 
    timeout: 5000
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  abiExporter: {
    path: './abi',
    runOnCompile: true,
    clear: true,
    spacing: 2,
  },
  diamondAbi: {
    name: "OutputAbi",
  },    
  gasReporter: {
    enabled: true,
    showMethodSig: true,
    maxMethodDiff: 10,
    gasPrice: 127,
  },
    contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
    },    
};

export default config;
