import type { SVGProps } from "react";

function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 12.25A4.25 4.25 0 0 1 12.25 8v0a4.25 4.25 0 0 1 4.25 4.25v0a4.25 4.25 0 0 1-4.25 4.25v0A4.25 4.25 0 0 1 8 12.25v0Z" />
      <path
        d="M12.25 3v1.5M21.5 12.25H20M18.791 18.791l-1.06-1.06M18.791 5.709l-1.06 1.06M12.25 20v1.5M4.5 12.25H3M6.77 6.77 5.709 5.709M6.77 17.73l-1.061 1.061"
        fill="none"
      />
    </svg>
  );
}

function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M17.25 16.22a6.937 6.937 0 0 1-9.47-9.47 7.451 7.451 0 1 0 9.47 9.47ZM12.75 7C17 7 17 2.75 17 2.75S17 7 21.25 7C17 7 17 11.25 17 11.25S17 7 12.75 7Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ModeToggle() {
  function disableTransitionsTemporarily() {
    document.documentElement.classList.add("[&_*]:!transition-none");
    window.setTimeout(() => {
      document.documentElement.classList.remove("[&_*]:!transition-none");
    }, 0);
  }

  function toggleColorMode() {
    disableTransitionsTemporarily();

    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const isSystemDarkMode = darkModeMediaQuery.matches;
    const isDarkMode = document.documentElement.classList.toggle("dark");

    document.documentElement.setAttribute(
      "data-force-color-scheme",
      isDarkMode ? "dark" : "light",
    );

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode;
    } else {
      window.localStorage.isDarkMode = isDarkMode;
    }
  }

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      className="relative inline-flex items-center gap-x-1.5 group rounded-full px-3 py-2 shadow-lg shadow-slate-800/5 ring-1 ring-slate-900/5 hover:shadow-slate-800/10 backdrop-blur transition dark:ring-white/10 dark:hover:ring-white/20"
      onClick={toggleColorMode}
    >
      <SunIcon className="h-6 w-6 fill-slate-100 stroke-slate-500 transition group-hover:fill-slate-200 group-hover:stroke-slate-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-amber-50 [@media(prefers-color-scheme:dark)]:stroke-amber-400 [@media(prefers-color-scheme:dark)]:group-hover:fill-amber-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-amber-600" />
      <MoonIcon className="hidden h-6 w-6 fill-slate-700 stroke-slate-500 transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-sky-200 [@media_not_(prefers-color-scheme:dark)]:fill-sky-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-sky-500" />
    </button>
  );
}

export default ModeToggle;
