import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
// import {searchStocks} from "@/lib/actions/finnhub.actions";
import UserDropdown from "./UseDropdown";

const Header = async ({ user }: { user: User }) => {
    // const initialStocks = await searchStocks();

    return (
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="/">
                    <Image src="/assets/icons/qopstock-logo.svg" alt="Qopztock-logo" width={140} height={32} className="h-8 w-auto cursor-pointer" />
                </Link>
                <nav className="hidden sm:block">
                    <NavItems />
                    {/* <NavItems initialStocks={initialStocks} /> */}
                </nav>

                <UserDropdown user={user} />
                {/* <UserDropdown user={user} initialStocks={initialStocks} /> */}
            </div>
        </header>
    )
}
export default Header