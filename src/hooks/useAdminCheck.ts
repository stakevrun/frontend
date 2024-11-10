import { useEffect, useState } from "react";
import { getAddress } from "viem";
import { API_URL } from '../constants';

export function useAdminCheck(address: string | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!address) {
        setIsAdmin(false);
        return;
      }

      try {
        console.log("running admin check");

        const adminAddresses: string[] = await fetch(
          `${API_URL}/admins`,
        ).then((r) => {
          console.log("Response status: ", r.status); // DEBUG
          console.log("Response body: ", r.body); // DEBUG
          return r.json()
      });
        // const adminAddresses: string[] = await Promise.resolve([]); // TEST

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
  }, [address]);

  return isAdmin;
}
