import React, { useState, useEffect } from 'react';

import { AiFillCopy, AiOutlineCheck } from "react-icons/ai";


const ContractTag = ({pubkey}) => {
  
  const [copied, setCopied] = useState(false);
  const [styles, setStyles] = useState({opacity: "0"});

  const handleCopyClick = () => {
    const textElement = document.getElementById('addressText');

    if (textElement) {
      const range = document.createRange();
      range.selectNodeContents(textElement);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
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
    setStyles({opacity: "1"});
    console.log("Change works!");
  };

  const revertStyles = () => {
    setStyles({opacity: "0"});
    console.log("Revert works!");
  };

  return (
    <div className='flex items-center gap-2 w-full'>
    
    
        <p id="addressText" aria-disabled>{pubkey}</p>
        {!copied && (
       <div className='relative cursor-pointer'>
            <div className="absolute top-7 bg-green-100 p-2 text-xs" style={styles}><span>Copy Address</span></div>
            <AiFillCopy className="text-xl" onClick={handleCopyClick} onMouseEnter={changeStyles} onMouseLeave={revertStyles}/>
          </div>
        )}
        {copied && (
          <div className='relative cursor-pointer'>
            <div className="absolute top-7 bg-green-100 p-2 text-xs" style={styles}><span>Copied!</span></div>
            <AiOutlineCheck className="text-xl" onMouseEnter={changeStyles} onMouseLeave={revertStyles} />
          </div>
        )}
    
    </div>
  );
};

export default ContractTag;
