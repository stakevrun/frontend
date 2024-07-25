import React, { useState, useEffect } from "react";

import { AiFillCopy, AiOutlineCheck } from "react-icons/ai";

const ContractTag = ({ pubkey }) => {
  const [copied, setCopied] = useState(false);
  const [styles, setStyles] = useState({
    opacity: "0",
    transition: "0.2s all ease-in-out",
  });

  const handleCopyClick = () => {
    const textElement = document.getElementById("addressText");

    if (textElement) {
      const range = document.createRange();
      range.selectNodeContents(textElement);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        selection.removeAllRanges();
        setCopied(true);
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [copied]);

  const changeStyles = () => {
    setStyles({
      opacity: "1",
      transition: "0.2s all ease-in-out",
    });
    console.log("Change works!");
  };

  const revertStyles = () => {
    setStyles({
      opacity: "0",
      transition: "0.2s all ease-in-out",
    });
    console.log("Revert works!");
  };

  return (
    <span className="flex items-center flex-col gap-2 justify-center  text-center text-wrap w-full xl:flex-row ">
      <p
        id="addressText"
        className="text-wrap word-break break-all"
        aria-disabled
      >
        {pubkey}
      </p>
      {!copied && (
        <span className="relative cursor-pointer">
          <span
            className="absolute top-7  text-gray-800  bg-gray-200 shadow-lg border-white-2 font-bold rounded-lg p-2 text-xs "
            style={styles}
          >
            <span>Copy Address</span>
          </span>
          <AiFillCopy
            className="text-xl"
            onClick={handleCopyClick}
            onMouseEnter={changeStyles}
            onMouseLeave={revertStyles}
          />
        </span>
      )}
      {copied && (
        <span className="relative cursor-pointer">
          <span
            className="absolute top-7 text-gray-800  bg-gray-200 shadow-lg border-white-2 font-bold rounded-lg p-2 text-xs "
            style={styles}
          >
            <span>Copied!</span>
          </span>
          <AiOutlineCheck
            className="text-xl"
            onMouseEnter={changeStyles}
            onMouseLeave={revertStyles}
          />
        </span>
      )}
    </span>
  );
};

export default ContractTag;
