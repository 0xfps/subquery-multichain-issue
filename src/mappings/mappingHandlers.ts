import { Transfer } from "../types";
import {
  TransferLog
} from "../types/abi-interfaces/Erc20Abi";
import assert from "assert";

const DUMMY_ETH_ADDRESS = "0x0000000000000000000000000000000000000012"

export async function handleArbitrumLog(log: TransferLog): Promise <void> {
  logger.info(`New transfer transaction log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");
  handleEvent(log, "arbitrum", "contract")
}

export async function handleArbitrumLogETH(log: TransferLog): Promise<void> {
  logger.info(`New ETH transfer transaction log at block ${log.blockNumber}`);
  if (!log.args) return
  handleEvent(log, "arbitrum", "native")
}

async function handleEvent(log: TransferLog, network: string, type: "native" | "contract") {
  const transaction = Transfer.create({
    id: log.transactionHash,
    blockHeight: BigInt(log.blockNumber),
    // @ts-ignore
    to: log.args.to,
    // @ts-ignore
    from: log.args.from,
    // @ts-ignore
    value: log.args.value.toBigInt(),
    network: network,
    contractAddress: type == "contract" ? log.address : DUMMY_ETH_ADDRESS,
  });

  await transaction.save();
}
