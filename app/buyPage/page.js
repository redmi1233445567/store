"use client"
import { useEffect, useState } from "react";
import { getAllProducts } from "../data/productsData";
import { getAllSells } from "../data/getAllSells";
import { addSell } from "../data/addSell";
import { ToastContainer, toast } from 'react-toastify';
import Header from "../component/Header";
import Status from "../component/Status";
import Filters from "../component/Filters";

export default function PurchasesPage() {

  const [products, setProducts] = useState([]);
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

  const showData = async () => {
    const data = await getAllProducts();
    const sellsData = await getAllSells();
    setProducts(data);
    setSells(sellsData);
    const today = new Date().toISOString().split("T")[0];
    setFilterData(() =>{
      const go = sellsData.filter((item) => item.date === today);
      valueCards(go);

      return go
  });
    setNameFilter("اليوم");
  };

  const valueCards = (arr) => {
    setCards(()=>({
      priceSells: arr.reduce((acc, num) => acc + num.price , 0),
      countSells: arr.length,
      win: arr.filter((item)=> item.or > 0).reduce((acc, num) => acc + num.or , 0),
      lose: arr.filter((item)=> item.or < 0).reduce((acc, num) => acc + num.or , 0),
      unPaid: arr.filter((item)=> item.status == "غير مدفوع").length,
      lastSell:arr[arr.length - 1]?.price
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected) {
      if (paymentType === "paid") {
        console.log({ sendPrice, sendQty })
        if (sendQty != undefined && sendPrice != undefined) {
          console.log("no")
          if (sendQty > onePro.qty || sendQty < 1 || sendPrice < 1) {
            toast.error("الكمية غير مقبولة او السعر  غير مقبول")
          } else {
            const today = new Date();
            let sell = {
              name: sendName,
              desc: sendDesc,
              status: "مدفوع",
              qty: sendQty,
              price: sendPrice,
              or: sendPrice - onePro.price,
              date: today.toISOString().split("T")[0],
              proId: onePro._id
            }

            try {
              await addSell(sell);
              toast.success(`تم اضافة ${sell.name}`);
              setSelectedPro((pre)=> {
                return { ...pre, qty: pre.qty - sendQty };
              })
              showData();

            } catch (err) {
              console.log(err);
              toast.error(err)
            }
          }
        } else {
          toast.error("حدد السعر والكمية")
        }
      } else {
        console.log({ sendPrice, sendQty })
        if (sendQty != undefined) {
          console.log("no")
          if (sendQty > onePro.qty || sendQty < 1) {
            toast.error("الكمية غير مقبول")
          } else {
            const today = new Date();
            let sell = {
              name: sendName,
              desc: sendDesc,
              status: "غير مدفوع",
              qty: sendQty,
              price: 0,
              or: -onePro.price,
              date: today.toISOString().split("T")[0],
              proId: onePro._id
            }

            try {
              await addSell(sell);
              toast.success(`تم اضافة ${sell.name}`);
              showData();
              setSelectedPro((pre) => {
                let one = { ...pre };
                console.log(one.qty - sendQty)
                one.qty = one.qty - sendQty;
                return one;
              });
              setOnePro((pre) => {
                let one = { ...pre };
                console.log(one.qty - sendQty)
                one.qty = one.qty - sendQty;
                return one;
              })

            } catch (err) {
              console.log(err);
              toast.error(err)
            }
          }
        } else {
          toast.error("حدد السعر والكمية")
        }
      }
    } else {
      toast.error("اختر صنف")
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
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring h-14 focus:ring-blue-200">
              <option onClick={() => selectPro("A")}>اختر الصنف</option>
              {products.map((p) => (
                <option key={p._id} onClick={() => { selectPro(p._id); setSendName(p.name) }}>{p.name}</option>
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
              onChange={(e) => setSendQty(e.target.value)}
              className={`w-full border border-gray-300 rounded-lg h-14 px-3 py-2 focus:ring focus:ring-blue-200 ${selected ? sendQty > selectedPro.qty || sendQty < 1 ? "text-red-500" : "text-black" : console.log("")}`}
            />
          </div>

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
              <label className="block text-sm font-medium">السعر - {selected && <span className="text-red-500"> سعر الجملة {selectedPro.price} سعر البيع {selectedPro.priceA}</span>}</label>
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
                <th className="p-2">الاسم</th>
                <th className="p-2">العدد</th>
                <th className="p-2">الحالة</th>
                <th className="p-2">السعر</th>
                <th className="p-2">حالة السعر</th>
                <th className="p-2">التاريخ</th>
                <th className="p-2">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {filterData && filterData.length > 0 ? [...filterData].reverse().map((p, ind) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">{ind + 1}</td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.qty}</td>
                  <td className={`p-2 ${p.status === "مدفوع" ? "text-green-600" : "text-red-600"}`}>
                    {p.status}
                  </td>
                  <td className="p-2">{p.price} ج.م</td>
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
