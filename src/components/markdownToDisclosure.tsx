import React, { ReactNode } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';

interface HeaderContentPair {
  header: ReactNode;
  content: ReactNode;
}

const MarkdownToDisclosure: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Split the children into an array of elements
  const elements = React.Children.toArray(children);
  
  // Group headers with their following paragraphs
  const groups: HeaderContentPair[] = [];
  for (let i = 0; i < elements.length; i += 2) {
    if (i + 1 < elements.length) {
      groups.push({
        header: elements[i],
        content: elements[i + 1]
      });
    }
  }

  return (
    <div className="w-full p-2 mx-auto rounded-2xl">
      {groups.map(({ header, content }, index) => (
        <Disclosure key={index} as="div" className="mt-2">
              <DisclosureButton className="w-full px-4 py-2 text-md font-medium text-center text-zinc-900 bg-zinc-100 rounded-lg hover:bg-zinc-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-opacity-75">
                <span>{React.isValidElement(header) ? header.props.children : header}</span>
              </DisclosureButton>
                <DisclosurePanel
                  className="px-4 pt-1 pb-4 text-sm text-gray-500"
                >
                  {content}
                </DisclosurePanel>
        </Disclosure>
      ))}
    </div>
  );
};

export default MarkdownToDisclosure;