import { useEffect, useState } from "react";
import { useReadBeaconNode } from "./useReadBeaconNode";

// Hardcoded for now, valid for Ethereum
const slotsPerEpoch = 32;
const secondsPerSlot = 12;

export function useCurrentEpoch() {
  const [error, setError] = useState<string>();
  const [currentEpoch, setCurrentEpoch] = useState<number>();

  const { data: beaconInfo, error: beaconInfoError, isLoading: beaconInfoIsLoading, } = useReadBeaconNode({path: `eth/v1/beacon/headers/head`});

  useEffect(() => {
    if(beaconInfoError) {
      let message: string = "An error occurred retreiving beacon info.";
      if (typeof beaconInfoError === "string") {
        message = beaconInfoError;
      } else if (beaconInfoError instanceof Error) {
        message = beaconInfoError.message;
      }
      setError(message);
    }
  }, [beaconInfoError, setError]);

  useEffect(() => {
    if(beaconInfo) {
      setCurrentEpoch(Math.floor(parseInt(beaconInfo.value.data.header.message.slot) / slotsPerEpoch));
    }
  }, [beaconInfo]);

  return {
    data: currentEpoch,
    error: error,
    isLoading: beaconInfoIsLoading,
  };
}

export function useDateFromEpoch({ epoch }: { epoch: number }) {
  const [error, setError] = useState<string>();
  const [date, setDate] = useState<Date>();

  const { data: currentEpoch, error: currentEpochError, isLoading: currentEpochIsLoading } = useCurrentEpoch();

  useEffect(() => {
    if(currentEpochError) {
      setError(currentEpochError);
    }
  }, [currentEpochError, setError]);

  useEffect(() => {
    if(epoch && currentEpoch) {
      const currentDate = new Date(Date.now());
      const epochDifference = epoch - currentEpoch;
      const milisecondsDifference = epochDifference * slotsPerEpoch * secondsPerSlot * 1000;
      setDate(new Date(currentDate.getTime() + milisecondsDifference));
    }
  }, [epoch, currentEpoch]);

  return {
    data: date,
    error: error,
    isLoading: currentEpochIsLoading,
  };
}
