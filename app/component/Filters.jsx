"use client"
import { useState } from "react";
import { toast } from "react-toastify";

function Filters({ showData, setFilterData, nameFilter, setNameFilter, sells, valueCards }) {
    const [month, setMonth] = useState("-- اختر الشهر --");
    const [yearMonth, setYearMonth] = useState("-- اختر السنة --");
    const [year, setYear] = useState("-- اختر السنة --");

    const handleFilterDay = (date) => {
        console.log(date)
        setFilterData(() => {
            const go = sells.filter((item) => item.date === date);
            valueCards(go);
            return go;
        });
        setNameFilter(date)
    };

    const handleFilterMonth = (year) => {
        if (month != "-- اختر الشهر --") {
            setFilterData(() => {
                const go = sells.filter((item) => item.date.includes(`${year}-${month}`));
                valueCards(go);
                return go;
            });
            setNameFilter(`${year}-${month}`)
            setMonth("-- اختر الشهر --");
            setYearMonth("-- اختر السنة --")
        } else {
            toast.error("دخل الشهر")
        }
    };

    const handleFilterYear = (year) => {
        setFilterData(() => {
            const go = sells.filter((item) => item.date.includes(`${year}`));
            valueCards(go);
            return go;
        });
        setNameFilter(year)
        setYear("-- اختر السنة --");
    }

    const all = () => {
        setFilterData(() => {
            const go = sells;
            valueCards(go);
            return go;
        });
        setNameFilter("الكل")
    }



    return (
        <div>
            <div className="bg-white shadow flex rounded-2xl p-4 mb-6 items-center gap-4 justify-around text-xl">
                <p>اظهار عمليات:</p>
                <div onClick={() => { showData(); setNameFilter("اليوم") }} className="p-[15px] px-[30px] font-bold cursor-pointer transition-all hover:bg-blue-400 bg-blue-500 text-white rounded-lg">اليوم</div>
                <div onClick={all} className="p-[15px] px-[30px] font-bold cursor-pointer transition-all hover:bg-blue-400 bg-blue-500 text-white rounded-lg">الكل</div>

                <div className="flex items-center">
                    <label className="block text-sm font-medium">اختر اليوم</label>
                    <input onChange={(e) => handleFilterDay(e.target.value)} lang="ar" dir="rtl" className="w-full border border-gray-300 h-14 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200" type="date" />
                </div>

                <div className="flex flex-col items-start">
                    <label className="block text-sm font-medium mb-1">اختر السنة والشهر</label>
                    <div className="flex gap-3">
                        {/* اختيار الشهر */}
                        <select
                            lang="ar"
                            dir="rtl"
                            value={month}
                            onChange={(e) => { setMonth(e.target.value); setYearMonth("-- اختر السنة --") }}
                            className="border border-gray-300 h-14 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                        >
                            <option value="">-- اختر الشهر --</option>
                            <option value="01">1</option>
                            <option value="02">2</option>
                            <option value="03">3</option>
                            <option value="04">4</option>
                            <option value="05">5</option>
                            <option value="06">6</option>
                            <option value="07">7</option>
                            <option value="08">8</option>
                            <option value="09">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>

                        {/* اختيار السنة */}
                        <select
                            lang="ar"
                            dir="rtl"
                            value={yearMonth}
                            onChange={(e) => {
                                const value = e.target.value; // ✅ متغير محلي
                                setYearMonth(value);
                                handleFilterMonth(value);
                            }}
                            className="border border-gray-300 h-14 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                        >
                            <option value="">-- اختر السنة --</option>
                            {Array.from({ length: 20 }, (_, i) => {
                                const year = 2010 + i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                <div className="flex items-center">
                    <label className="block text-sm font-medium">اختر السنة</label>
                    <select
                        lang="ar"
                        dir="rtl"
                        value={year}
                        onChange={(e) => {
                            const value = e.target.value; // ✅ متغير محلي
                            setYear(value);
                            handleFilterYear(value);
                        }}
                        className="w-full border border-gray-300 h-14 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                    >
                        <option value="">-- اختر السنة --</option>
                        {Array.from({ length: 21 }, (_, i) => {
                            const year = 2010 + i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <div className="m-[20px] mx-auto w-fit p-[15px] px-[30px] text-2xl text-white font-bold bg-blue-400 rounded-2xl">{nameFilter}</div>
        </div>
    );
}

export default Filters;