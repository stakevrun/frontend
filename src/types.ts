// Validators

export type beaconLog = {
  attester_slashings: bigint;
  day: number;
  day_end: string;
  day_start: string;
  deposits: bigint;
  deposits_amount: bigint;
  end_balance: bigint;
  end_effective_balance: bigint;
  max_balance: bigint;
  max_effective_balance: bigint;
  min_balance: bigint;
  min_effective_balance: bigint;
  missed_attestations: number;
  missed_blocks: number;
  missed_sync: number;
  orphaned_attestations: number;
  orphaned_blocks: number;
  orphaned_sync: number;
  participated_sync: number;
  proposed_blocks: number;
  proposer_slashings: bigint;
  start_balance: bigint;
  start_effective_balance: bigint;
  validatorindex: number;
  withdrawals: bigint;
  withdrawals_amount: bigint;
};