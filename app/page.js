"use client";
import { useEffect, useState } from "react";
import { X, Trash2, Edit, LayoutPanelLeft, LogOut, Box, Layers, CircleDollarSign, TriangleAlert } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import { getAllProducts } from "./data/productsData";
import { updateProduct } from "./data/editeProduct";
import { deleteProduct } from "./data/deleteProduct";
import { addProduct } from "./data/addProduct";
import Link from "next/link";
import Header from "./component/Header";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const router = useRouter();
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUp, setIsUp] = useState(false);
  const [addCat, setAddCat] = useState(false)
  const [name, setName] = useState();
  const [desc, setDesc] = useState();
  const [category1, setCategory1] = useState();
  const [qty, setQty] = useState();
  const [price, setPrice] = useState();
  const [priceA, setPriceA] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [id, setId] = useState(0);
  const [products, setProducts] = useState([]);
  const [filterData, setFilterData] = useState(products)
  const [lowPro, setLowPro] = useState(filterData.filter((item) => item.qty < 10).length);
  const [allQty, setAllQty] = useState(filterData.reduce((acc, num) => acc + Number(num.qty), 0));
  const [allPrice, setAllPrice] = useState(filterData.reduce((acc, num) => acc + num.price * num.qty, 0));
  const [allPriceA, setAllPriceA] = useState(filterData.reduce((acc, num) => acc + num.priceA * num.qty, 0));
  const [category, setCategory] = useState([...new Set(filterData.map((p) => p.category))]);

  useEffect(() => {
    showData()
  }, []);

  const recetValues = () => {
    setName("");
    setPrice();
    setPriceA();
    setDesc();
    setCategory1();
    setQty()
  }

  const showData = async () => {
    const data = await getAllProducts();
    if (data !== "no products found..") {
      console.log(data)
      setProducts(data);
      setFilterData(data);
      setCategory([...new Set(data.map((p) => p.category))]);
      setLowPro(data.filter((item) => item.qty < 10).length);
      setAllPrice(data.reduce((acc, num) => acc + num.price * num.qty, 0));
      setAllQty(data.reduce((acc, num) => acc + Number(num.qty), 0));
      setAllPriceA(data.reduce((acc, num) => acc + num.priceA * num.qty, 0))
    }

  }


  let handleUpdateClick = (product) => {
    setName(product.name);
    setCategory1(product.category);
    setDesc(product.desc);
    setPrice(product.price);
    setQty(product.qty);
    setId(product._id);
    setPriceA(product.priceA)
    setIsUp(true);           // يفتح المودال
  };

  const handleDeleteClick = (product) => {
    setName(product.name);
    setCategory1(product.category);
    setQty(product.qty);
    setId(product._id)
    setDeleteModal(true);
  };

  const handleAddPro = async (e) => {
    e.preventDefault();
    if (name != "" && price != "" && priceA != "" && qty != "" && category1 != "") {
      if (qty < 1 || name.length < 2) {
        toast.error(`الكمية قليلة او الاسم صغير`)
      } else {
        const today = new Date();
        let pro1 = {
          name,
          desc,
          category: category1,
          qty,
          price,
          priceA,
          date: today.toLocaleDateString("ar-EG"),
        };

        try {
          await addProduct(pro1);
          toast.success(`تم اضافة ${pro1.name}`);
          showData();
          setIsOpen(false);
          recetValues()

        } catch (err) {
          console.log(err);
          toast.error(err)
        }
      }
    } else {
      toast.error(`البيانات ناقصة`);

    }
  };

  const handleDeleteItem = async () => {
    try {
      await deleteProduct(id);
      toast.success(`تم حذف ${name}`);
      showData();
      recetValues();
      setDeleteModal(false);
    } catch (err) {
      toast.error(`${err}`);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (name != "" && price != "" && priceA != "" && qty != "" && category1 != "") {
      if (qty < 1 || name.length < 2) {
        toast.error(`الكمية قليلة او الاسم صغير`)
      } else {
        const today = new Date();
        let pro1 = {
          name,
          desc,
          category: category1,
          qty,
          price,
          priceA,
          date: today.toLocaleDateString("ar-EG"),
        };
        console.log({ id, pro1 })
        try {
          await updateProduct(id, pro1);
          toast.success(`تم تعديل ${name}`);
          showData();
          setIsUp(false)
        } catch (err) {
          console.error("Error while updating:", err);
          toast.error("حصل خطأ أثناء التعديل");
        }
      }
    } else {
      toast.error(`البيانات ناقصة`);

    }

  }

  const handleCatFilter = (cat) => {
    if (cat == 1) {
      setFilterData(() => {
        const all = products;

        setAllQty(all.reduce((acc, num) => acc + Number(num.qty), 0));
        setAllPrice(all.reduce((acc, num) => acc + num.price * num.qty, 0));
        setAllPriceA(all.reduce((acc, num) => acc + num.priceA * num.qty, 0));
        setLowPro(all.filter((item) => item.qty < 10).length);

        return all;
      });

    } else {
      setFilterData(() => {
        const filterCat = products.filter((item) => item.category == cat);
        console.log(filterCat);

        setAllQty(filterCat.reduce((acc, num) => acc + Number(num.qty), 0));
        setAllPrice(filterCat.reduce((acc, num) => acc + num.price * num.qty, 0));
        setAllPriceA(filterCat.reduce((acc, num) => acc + num.priceA * num.qty, 0));
        setLowPro(filterCat.filter((item) => item.qty < 10).length);

        return filterCat
      });

    }
  };

  const handleFilterInput = (word) => {
    setFilterData(() => {
      const filterCat = products.filter((item) => item.name.includes(word));
      return filterCat
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الهيدر */}
      <Header />

      {/* الإحصائيات */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-5 gap-4 my-[20px]">
        <div className="bg-white flex items-center gap-4 rounded-lg shadow p-4 border border-gray-200">
          <div className="bg-blue-100 w-fit p-[10px] rounded-lg">
            <Box className="text-blue-500" size={40} />
          </div>
          <div>
            <p className="text-sm text-gray-500">إجمالي الأصناف</p>
            <p className="text-2xl font-bold text-gray-700">{filterData.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg flex items-center gap-4 shadow p-4 border border-gray-200">
          <div className="bg-red-100 w-fit p-[10px] rounded-lg">
            <TriangleAlert className="text-red-500" size={40} />
          </div>
          <div>
            <p className="text-sm text-gray-500">مخزون منخفض</p>
            <p className="text-2xl font-bold text-gray-700">{lowPro}</p>
          </div>
        </div>
        <div className="bg-white flex items-center gap-4 rounded-lg shadow p-4 border border-gray-200">
          <div className="bg-green-100 w-fit p-[10px] rounded-lg">
            <Layers className="text-green-500" size={40} />
          </div>
          <div>
            <p className="text-sm text-gray-500">إجمالي الكمية</p>
            <p className="text-2xl font-bold text-gray-700">{allQty}</p>
          </div>
        </div>
        <div className="bg-white flex items-center gap-4 rounded-lg shadow p-4 border border-gray-200">
          <div className="bg-yellow-100 w-fit p-[10px] rounded-lg">
            <CircleDollarSign className="text-yellow-500" size={40} />
          </div>
          <div>
            <p className="text-sm text-gray-500">إجمالي قيمة الجملة</p>
            <p className="text-xl font-bold text-gray-700">{allPrice} ج.م</p>
          </div>

        </div>
        <div className="bg-white flex items-center gap-4 rounded-lg shadow p-4 border border-gray-200">
          <div className="bg-gray-100 w-fit p-[10px] rounded-lg">
            <CircleDollarSign className="text-gray-500" size={40} />
          </div>
          <div>
            <p className="text-sm text-gray-500">إجمالي القيمة البيع</p>
            <p className="text-xl font-bold text-gray-700">{allPriceA} ج.م</p>
          </div>

        </div>
      </div>

      {/* الأدوات */}
      <div className="max-w-7xl mx-auto px-4 flex gap-3 mb-4">
        <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow">
          + إضافة بضاعة
        </button>
        <Link href="./buyPage">
          <button

            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
          >
            - سحب بضاعة
          </button></Link>
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option onClick={() => handleCatFilter(1)}>جميع الفئات</option>
          {category.map((p, ind) => (
            <option key={ind} onClick={() => handleCatFilter(p)}>{p}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="البحث في المخزون..."
          dir="rtl"
          onChange={(e) => handleFilterInput(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
        />
      </div>

      {/* الجدول */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-gray-600">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-right">الصنف</th>
                <th className="py-3 px-4 text-right">الفئة</th>
                <th className="py-3 px-4 text-right">الكمية</th>
                <th className="py-3 px-4 text-right">سعر الجملة</th>
                <th className="py-3 px-4 text-right">سعر البيع</th>
                <th className="py-3 px-4 text-right">التاريخ</th>
                <th className="py-3 px-4 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filterData.length ? filterData.map((item) => (
                <tr key={item._id} className="border-t border-gray-200 hover:bg-gray-100">
                  <td className="py-4 px-4 text-black font-bold"><p>{item.name}</p><p className="text-gray-500 text-[12px] font-normal">{item.desc}</p></td>
                  <td className="py-4 px-4">{item.category}</td>
                  <td className="py-4 px-4">{item.qty}</td>
                  <td className="py-4 px-4">{item.price}</td>
                  <td className="py-4 px-4">{item.priceA}</td>
                  <td className="py-4 px-4">{item.date}</td>
                  <td className="py-4 px-4 flex gap-2 justify-end">
                    <button onClick={() => handleUpdateClick(item)} className="px-2 py-1 bg-blue-100 cursor-pointer text-blue-600 rounded hover:bg-blue-200">
                      <Edit />
                    </button>
                    <button onClick={() => handleDeleteClick(item)} className="px-2 py-1 bg-red-100 cursor-pointer text-red-600 rounded hover:bg-red-200">
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              )) : <tr><td className="text-center text-2xl">لا يوجد بضاعة</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* البوب أب - سحب بضاعة */}
      {openWithdraw && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            {/* زرار إغلاق */}
            <button
              onClick={() => setOpenWithdraw(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              سحب بضاعة من المخزون
            </h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              اختر الصنف والكمية التي تريد سحبها
            </p>

            <form className="space-y-4">
              {/* اختيار الصنف */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اختر الصنف *
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200">
                  <option>اختر الصنف</option>
                  {products.map((p) => (
                    <option key={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* الكمية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الكمية المطلوب سحبها *
                </label>
                <input
                  type="number"
                  placeholder="أدخل الكمية"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                />
              </div>

              {/* ملاحظات */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ملاحظات
                </label>
                <textarea
                  placeholder="ملاحظات اختيارية حول عملية السحب"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                ></textarea>
              </div>

              {/* الأزرار */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setOpenWithdraw(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
                >
                  سحب البضاعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* المودال */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
            {/* إغلاق */}
            <button
              onClick={() => { setIsOpen(false); recetValues() }}
              className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={22} />
            </button>

            {/* العنوان */}
            <h2 className="text-xl font-bold mb-1">إضافة بضاعة جديدة</h2>
            <p className="text-sm text-gray-500 mb-4">
              أدخل تفاصيل البضاعة التي تريد إضافتها للمخزون
            </p>

            {/* النموذج */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-1">اسم الصنف *</label>
                <input
                  type="text"
                  placeholder="أدخل اسم الصنف"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">الفئة *</label>
                  <select
                    onChange={(e) => {
                      if (e.target.value === "add_new") {
                        const newCat = prompt("أدخل اسم الفئة الجديدة:");
                        if (newCat) {
                          setCategory((prev) => [...prev, newCat]); // يضيفها في القائمة
                          setCategory1(newCat); // يختارها تلقائي
                        }
                      } else {
                        setCategory1(e.target.value);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">اختر الفئة</option>
                    {category.map((p, ind) => (
                      <option key={ind} value={p}>
                        {p}
                      </option>
                    ))}
                    <option value="add_new">+ إضافة فئة جديدة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">الكمية *</label>
                  <input
                    type="number"
                    pattern="\d*"
                    min="0"
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">
                  السعر للقطعة الواحدة (ج.م) *
                </label>
                <input
                  type="number"
                  min="0"
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">
                  سعر بيع للقطعة الواحدة (ج.م) *
                </label>
                <input
                  type="number"
                  min="0"
                  onChange={(e) => setPriceA(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">الوصف</label>
                <textarea
                  rows="3"
                  placeholder="وصف اختياري للبضاعة"
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                ></textarea>
              </div>

              {/* الأزرار */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); recetValues() }}
                  className="px-4 py-2 rounded-lg border-gray-300 cursor-pointer border"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddPro}
                  className="px-4 py-2 rounded-lg bg-blue-600 cursor-pointer text-white"
                >
                  + إضافة البضاعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isUp && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
            {/* إغلاق */}
            <button
              onClick={() => { setIsUp(false); recetValues() }}
              className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={22} />
            </button>

            {/* العنوان */}
            <h2 className="text-xl font-bold mb-1">تعديل بضاعة</h2>
            <p className="text-sm text-gray-500 mb-4">
              أدخل تفاصيل البضاعة التي تريد تعديلها
            </p>

            {/* النموذج */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-1">اسم الصنف *</label>
                <input
                  type="text"
                  placeholder="أدخل اسم الصنف"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">الفئة *</label>
                  <select value={category1}
                    onChange={(e) => {
                      if (e.target.value === "add_new") {
                        const newCat = prompt("أدخل اسم الفئة الجديدة:");
                        if (newCat) {
                          setCategory((prev) => [...prev, newCat]); // يضيفها في القائمة
                          setCategory1(newCat); // يختارها تلقائي
                        }
                      } else {
                        setCategory1(e.target.value);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">اختر الفئة</option>
                    {category.map((p, ind) => (
                      <option key={ind} value={p}>
                        {p}
                      </option>
                    ))}
                    <option value="add_new">+ إضافة فئة جديدة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">الكمية *</label>
                  <input
                    type="number"
                    min="0"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">
                  السعر للقطعة الواحدة (ج.م) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  سعر بيع للقطعة الواحدة (ج.م) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={priceA}
                  onChange={(e) => setPriceA(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">الوصف</label>
                <textarea
                  rows="3"
                  placeholder="وصف اختياري للبضاعة"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                ></textarea>
              </div>

              {/* الأزرار */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsUp(false); recetValues() }}
                  className="px-4 py-2 rounded-lg border-gray-300 cursor-pointer border"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleUpdateItem}
                  className="px-4 py-2 rounded-lg bg-blue-600 cursor-pointer text-white"
                >
                  + إضافة البضاعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )};
      {/* المودال */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <div className="flex items-center gap-4 mb-4">
              <div className="px-2 py-1 bg-red-100 text-red-600 rounded ">
                <Trash2 size={35} />
              </div>
              <div>
                <h2 className="font-bold">تأكيد الحذف</h2>
                <p className="">
                  هل أنت متأكد من حذف هذا الصنف؟
                </p>
              </div>
            </div>
            <div className="bg-gray-100 p-3 rounded mb-4 text-right">
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-gray-600">الفئة: {category1}</p>
              <p className="text-sm text-gray-600">الكمية: {qty}</p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => { setDeleteModal(false); setId(0); recetValues() }}
                className="bg-gray-200 px-4 py-2 rounded cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteItem}
                className="bg-red-500 flex gap-2 text-white px-4 py-2 items-center rounded cursor-pointer"
              >
                <Trash2 size={16} />
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};