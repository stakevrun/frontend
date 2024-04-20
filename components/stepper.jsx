
import React, { useState } from "react";
import styles from "../styles/Home.module.css"
import { TiTick } from "react-icons/ti";



const Stepper = () => {

    const steps = ["Customer Info", "Shipping Info", "Payment", "Step 4"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

    return (

        <div className="bg-gray-900 flex flex-col w-full gap-10 h-screen items-center justify-center">
            <div className="flex justify-between  items center text-black">
                {steps?.map((step, i) => (
                    <div
                        key={i}
                        className={`${styles.stepItem} ${currentStep === i + 1 && styles.active} ${(i + 1 < currentStep || complete) && styles.complete
                            } `}
                    >
                        <div className={styles.step}>
                            {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
                        </div>
                        <p className="text-gray-500">{step}</p>
                    </div>
                ))}
            </div>
            {!complete && (
                <button
                    className="btn"
                    onClick={() => {
                        currentStep === steps.length
                            ? setComplete(true)
                            : setCurrentStep((prev) => prev + 1);
                    }}
                >
                    {currentStep === steps.length ? "Finish" : "Next"}
                </button>
            )}
        </div>


    )
}

export default Stepper