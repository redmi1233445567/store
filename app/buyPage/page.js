"use client"
import { useEffect, useRef, useState } from "react";
import { getAllProducts } from "../data/productsData";
import { getAllSells } from "../data/getAllSells";
import { addSell } from "../data/addSell";
import { ToastContainer, toast } from 'react-toastify';
import Header from "../component/Header";
import Status from "../component/Status";
import Filters from "../component/Filters";
import right from "../../img/right1.png";
import no from "../../img/no.png"
import Image from "next/image";

export default function PurchasesPage() {

  const [products, setProducts] = useState([]);
  const select = useRef();
  const qty = useRef()
  const [sells, setSells] = useState([]);
  const [filterData, setFilterData] = useState(sells);
  const [paymentType, setPaymentType] = useState("paid");
  const [selected, setSelected] = useState(false)
  const [selectedPro, setSelectedPro] = useState();
  const [sendName, setSendName] = useState();
  const [sendQty, setSendQty] = useState();
  const [sendPrice, setSendPrice] = useState();
  const [sendDesc, setSendDesc] = useState();
  const [onePro, setOnePro] = useState();
  const [allProSent, setAllProSent] = useState([])
  const [nameFilter, setNameFilter] = useState("اليوم");
  const [cards, setCards] = useState({
    priceSells: 0,
    countSells: 0,
    win: 0,
    lose: 0,
    unPaid: 0,
    lastSell: null
  })

  useEffect(() => {
    showData()
  }, []);

  const addProSent = () => {
    if (selected) {
      if (sendQty != undefined) {
        console.log("no")
        if (sendQty > onePro.qty || sendQty < 1) {
          toast.error("الكمية غير مقبولة")
        } else {
          let sell = {
            id: Math.random().toString(36).substring(2, 10),
            name: sendName,
            qty: sendQty,
            price: onePro.priceA * sendQty,
            proId: onePro._id
          }
          setAllProSent((prv) => {
            const go = [...prv, sell];
            return go;
          });
          setSelectedPro((pre) => {
            return { ...pre, qty: pre.qty - sendQty };
          });
          select.current.value = "اختر الصنف";
          setSendName("");
          setSendQty("");
          qty.current.value = ""
          setSelected("")

        }
      } else {
        toast.error("حدد الكمية")
      }
    } else {
      toast.error("اختر صنف")
    }
  };

  const deleteOneProSent = (id) => {
    setAllProSent((pre) => {
      const go = pre.filter((item) => item.id !== id);
      return go;
    })
  }

  const showData = async () => {
    const data = await getAllProducts();
    const sellsData = await getAllSells();
    setProducts(data);
    setSells(sellsData);
    const today = new Date().toISOString().split("T")[0];
    setFilterData(() => {
      const go = sellsData.filter((item) => item.date === today);
      valueCards(go);

      return go
    });
    setNameFilter("اليوم");
  };

  const valueCards = (arr) => {
    setCards(() => ({
      priceSells: arr.reduce((acc, num) => acc + num.paided, 0),
      countSells: arr.length,
      win: arr.filter((item) => item.or > 0).reduce((acc, num) => acc + num.or, 0),
      lose: arr.filter((item) => item.or < 0).reduce((acc, num) => acc + num.or, 0),
      unPaid: arr.filter((item) => item.status == "غير مدفوع").length,
      lastSell: arr[arr.length - 1]?.price
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentType === "paid") {
      if (sendPrice != undefined && allProSent.length !== 0) {
        console.log("no")
        if (sendPrice < 1) {
          toast.error("السعر  غير مقبول")
        } else {
          const today = new Date();
          let sell = {
            sells: allProSent,
            status: "مدفوع",
            date: today.toISOString().split("T")[0],
            paided: sendPrice,
            desc: sendDesc
          }

          try {
            await addSell(sell);
            toast.success(`تم الاضافة`);
            setAllProSent([]);
            showData();

          } catch (err) {
            console.log(err);
            toast.error(err)
          }
        }
      } else {
        toast.error("حدد السعر والمنتجات")
      }
    } else {
      if (allProSent.length !== 0) {
        const today = new Date();
        let sell = {
          sells: allProSent,
          status: "غير مدفوع",
          date: today.toISOString().split("T")[0],
          paided: 0,
          desc: sendDesc
        }

        try {
          await addSell(sell);
          toast.success(`تم الاضافة`);
          setAllProSent([]);
          showData();

        } catch (err) {
          console.log(err);
          toast.error(err)
        }

      } else {
        toast.error("حدد المنتجات")
      }
    }

  };

  const selectPro = (id) => {
    if (id != "A") {
      let pro1 = products.filter((item) => item._id == id);
      console.log(pro1)
      setOnePro(pro1[0])
      setSelectedPro(() => {
        const qty = pro1[0];
        setSelected(true);
        return qty
      });
    } else {
      setSelected(false);
    }
  };


  return (
    <div>
      {/* الهيدر */}
      <Header />
      <div className="p-6">

        {/* البطاقات العلوية */}
        <Status cards={cards} />

        {/* الفورم */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-2xl p-4 mb-6 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اختر الصنف *
            </label>
            <select ref={select} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring h-14 focus:ring-blue-200">
              <option onClick={() => selectPro("A")}>اختر الصنف</option>
              {products.map((p) => (
                <option key={p._id} onClick={() => { selectPro(p._id); setSendName(p.name) }}>{p.name} - {p.price} - {p.priceA} - القطع المتوفرة {p.qty}</option>
              ))}
            </select>
          </div>
          {/* الكمية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الكمية المطلوب سحبها * {selected && <span className="text-red-500">الكمية يجب الا تتخطي {selectedPro.qty}</span>}
            </label>
            <input
              type="number"
              placeholder="أدخل الكمية"
              ref={qty}
              onChange={(e) => setSendQty(e.target.value)}
              className={`w-full border border-gray-300 rounded-lg h-14 px-3 py-2 focus:ring focus:ring-blue-200 ${selected ? sendQty > selectedPro.qty || sendQty < 1 ? "text-red-500" : "text-black" : console.log("")}`}
            />
          </div>
          <Image
            src={right}
            onClick={addProSent}
            className="w-[70px] h-[70px] cursor-pointer transition-all hover:translate-y-1 shadow-green-300 shadow-lg rounded-full"
            alt="Picture of the author"
          />
          <div className="w-full p-4">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b">
                  <th className="p-2">#</th>
                  <th className="p-2">الاسم</th>
                  <th className="p-2">العدد</th>
                  <th className="p-2">السعر</th>
                  <th className="p-2">حذف</th>
                </tr>
              </thead>
              <tbody>
                {allProSent && allProSent.length > 0 ? [...allProSent].reverse().map((p, ind) => (
                  <tr key={ind} className="border-b">
                    <td className="p-2">{ind + 1}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.qty}</td>
                    <td className="p-2">{p.price} ج.م</td>
                    <td><Image
                      src={no}
                      onClick={() => deleteOneProSent(p.id)}
                      className="w-[15px] h-[15px] cursor-pointer"
                      alt="Picture of the author"
                    /></td>
                  </tr>
                )) : <tr><td>-------</td></tr>}
              </tbody>
            </table>
          </div>
          <div></div>
          <div></div>

          <div>
            <label className="block text-sm font-medium">طريقة الدفع</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full border rounded-lg px-3 border-gray-300 h-14 py-2"
            >
              <option value="paid">مدفوع</option>
              <option value="unpaid">غير مدفوع</option>
            </select>
          </div>
          {paymentType === "paid" && (
            <div>
              <label className="block text-sm font-medium">السعر - {<span className="text-red-500"> سعر بيع القطع {allProSent.reduce((acc, item) => acc + item.price, 0)}</span>}</label>
              <input
                type="number"
                onChange={(e) => setSendPrice(e.target.value)}
                placeholder="أدخل السعر"
                className={`w-full border rounded-lg border-gray-300 h-14 px-3 py-2 `}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملاحظات
            </label>
            <textarea
              placeholder="ملاحظات اختيارية حول عملية السحب"
              onChange={(e) => setSendDesc(e.target.value)}
              className="w-full border border-gray-300 h-14 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            ></textarea>
          </div>
          <button type="submit" className="col-span-3 bg-blue-500 cursor-pointer transition-all hover:scale-x-[90%] text-white rounded-lg py-2">
            إضافة شراء
          </button>
        </form>
        {/* filters */}
        <Filters showData={showData} valueCards={valueCards} setFilterData={setFilterData} sells={sells} nameFilter={nameFilter} setNameFilter={setNameFilter} />

        {/* جدول العمليات */}
        <div className="bg-white shadow rounded-2xl p-4">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b">
                <th className="p-2">#</th>
                <th className="p-2">الطلب</th>
                <th className="p-2">الحالة</th>
                <th className="p-2">السعر الاجمالي</th>
                <th className="p-2">تم دفع</th>
                <th className="p-2">حالة السعر</th>
                <th className="p-2">التاريخ</th>
                <th className="p-2">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {filterData && filterData.length > 0 ? [...filterData].reverse().map((p, ind) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">{ind + 1}</td>
                  {p.sells.map((item, ind) => {
                    return (
                      <td key={ind} className="flex">
                        <div className="w-[60px]">{item.name} -</div>
                        <div className="w-[90px]">{item.qty} قطعة -</div>
                        <div className="w-[60px]">{item.price} ج.م</div>
                      </td>
                    )
                  })}
                  <td className={`p-2 ${p.status === "مدفوع" ? "text-green-600" : "text-red-600"}`}>
                    {p.status}
                  </td>
                  <td className="p-2">{p.allPrice} ج.م</td>
                  <th className="p-2">{p.paided}</th>
                  <td className={`p-2 ${p.or < 0 ? "text-red-600" : "text-green-600"}`}>{p.or} ج.م</td>
                  <td className="p-2">{p.date}</td>
                  <td className="p-2">{p.desc}</td>
                </tr>
              )) : <tr><td>لايوجد عمليات</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
