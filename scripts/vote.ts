import * as fs from "fs";
// @ts-ignore
import { network, ethers } from "hardhat";
import {
  proposalsFile,
  developmentChains,
  VOTING_PERIOD,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";

const index = 0;

async function vote(proposalIndex: number) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  const proposalId = proposals[network.config.chainId!][proposalIndex];

  const voteWay = 1;
  const governor = await ethers.getContract("GovernorContract");
  const reason = "vote in a dao";
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  await voteTxResponse.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log("Voted.");
}

vote(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
