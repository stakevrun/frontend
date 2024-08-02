import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { getAddress } from "viem";

export function useAdminCheck(address: string | undefined) {
  const { data: walletClient } = useWalletClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!address || !walletClient) {
        setIsAdmin(false);
        return;
      }

      try {
        console.log("running admin check");

        const adminAddresses: string[] = await fetch(
          "https://api.vrün.com/admins",
          { mode: "no-cors" },
        ).then((r) => r.json());
        // const adminAddresses: string[] = await Promise.resolve([]); // for testing purposes

        adminAddresses.push(
          "0x9c2bA9B3d7Ef4f759C2fEb2E174Ef14F8C64b46e".toLowerCase()
        ); // TEST

        const normalizedAddress = getAddress(address).toLowerCase();
        setIsAdmin(adminAddresses.includes(normalizedAddress));
      } catch (error) {
        console.log(error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [address, walletClient]);

  return isAdmin;
}
