import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="404 - Page Not Found | ANINO Law Firm"
        description="The page you are looking for could not be found"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-white dark:bg-gray-900 z-1">
        <GridShape />
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 font-bold text-gray-900 dark:text-white text-title-md xl:text-title-2xl">
            ERROR
          </h1>

          <img src="/images/error/404.svg" alt="404" className="dark:hidden" />
          <img
            src="/images/error/404-dark.svg"
            alt="404"
            className="hidden dark:block"
          />

          <p className="mt-10 mb-6 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
            We can't seem to find the page you are looking for!
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg 
            bg-[#D4AF37] hover:bg-[#C4A037] px-5 py-3.5 text-sm font-medium 
            text-white shadow-theme-xs transition-all duration-300"
          >
            Back to Home Page
          </Link>
        </div>
        {/* <!-- Footer --> */}
        <p className="absolute text-sm text-center text-gray-500 dark:text-gray-400 -translate-x-1/2 bottom-6 left-1/2">
          &copy; {new Date().getFullYear()} - ANINO Law Firm & Real Estate
          Consultancy
        </p>
      </div>
    </>
  );
}
