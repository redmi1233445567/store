"use client"
import Cookies from "js-cookie";
import { LayoutPanelLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

function Header() {
    const router = useRouter()

    const handellLogOut = () => {
        Cookies.remove("authUser");
        router.push("../login");
    };

    return (
        <header className="bg-white py-4 shadow-sm border-b border-gray-200 flex justify-between px-[20px]">
            <div className="px-4 flex justify-center items-center w-fit bg-blue-100 gap-[10px] rounded-xl hover:bg-blue-200 transition-all cursor-pointer">
                <LayoutPanelLeft className="text-blue-500" />
                <h1 className="text-xl font-semibold text-blue-500">البيع</h1>
            </div>
            <div onClick={handellLogOut} className="px-4 py-[15px] flex gap-[10px] justify-center items-center w-fit bg-red-100 rounded-xl hover:bg-red-200 transition-all cursor-pointer">
                <h1 className="font-semibold text-red-500">تسجيل خروج</h1>
                <LogOut className="text-red-500" />
            </div>
        </header>
    );
}

export default Header;