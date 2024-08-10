import React, { ReactNode } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";

interface HeaderContentPair {
  header: ReactNode;
  content: ReactNode;
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
        header: elements[i],
        content: elements[i + 1],
      });
    }
  }

  return (
    <div className="w-full mx-auto rounded-2xl">
      {groups.map(({ header, content }, index) => (
        <Disclosure key={index} as="div" className="mt-4">
          {({ open }) => (
            <>
              <DisclosureButton className="w-full flex flex-row justify-between p-4 text-md font-medium text-sky-950 bg-sky-100 rounded-lg hover:bg-sky-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-opacity-75">
                <span>
                  {React.isValidElement(header)
                    ? header.props.children
                    : header}
                </span>
                <span className="self-center">{open ? <CiCircleMinus /> : <CiCirclePlus />}</span>
              </DisclosureButton>
              <DisclosurePanel className="px-4 pt-1 pb-4 text-sm text-gray-500">
                {content}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};

export default MarkdownToDisclosure;
