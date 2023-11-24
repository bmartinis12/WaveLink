import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Custom404() {
    return (
        <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-10">
            <div className="flex items-center justify-center text-white">
                <span className="text-xl sm:text-4xl text-center">Sorry, this page does not exist!</span>
            </div>
            <Link href='/'>
                <button className="flex items-center justify-center gap-4 bg-search-input-container-background p-5 rounded-lg">
                    <span className="text-white text-xl sm:text-2xl">Return Home</span>
                    <FaArrowRight className="text-white text-xl sm:text-2xl" />
                </button>
            </Link>
        </div>
    );
}