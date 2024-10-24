import React, { type ReactNode } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";

interface HeaderContentPair {
  question: ReactNode;
  answer: ReactNode;
}

const MarkdownToDisclosure: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Split the children into an array of elements
  const elements = React.Children.toArray(children);

  // Group headers with their corresponding content
  const groups: HeaderContentPair[] = [];
  for (let i = 0; i < elements.length; i += 2) {
    if (i + 1 < elements.length) {
      groups.push({
        question: elements[i],
        answer: elements[i + 1],
      });
    }
  }

  return (
    <dl className="mt-10 space-y-6 divide-y divide-zinc-900/10">
      {groups.map(({ question, answer }, index) => (
        <Disclosure key={index} as="div" className="pt-6">
          <dt>
            <DisclosureButton className="group flex w-full items-start justify-between text-left text-zinc-900 dark:text-zinc-100">
              <span className="text-lg font-semibold leading-7">
                {question}
              </span>
              <span className="ml-6 flex h-7 items-center text-zinc-900 dark:text-zinc-100 ">
                <CiCirclePlus
                  aria-hidden="true"
                  className="h-6 w-6 group-data-[open]:hidden"
                />
                <CiCircleMinus
                  aria-hidden="true"
                  className="h-6 w-6 [.group:not([data-open])_&]:hidden"
                />
              </span>
            </DisclosureButton>
          </dt>
          <DisclosurePanel as="dd" className="mt-2 pr-12">
            <p className="text-base font-thin tracking-wide leading-7 text-zinc-600 dark:text-zinc-300">{answer}</p>
          </DisclosurePanel>
        </Disclosure>
      ))}
    </dl>
  );
};

export default MarkdownToDisclosure;
