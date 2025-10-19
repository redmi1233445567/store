function Status({cards}) {
    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow rounded-2xl p-4 text-center">
                <p className="text-gray-500">إجمالي المشتريات</p>
                <p className="text-xl font-bold text-green-600">
                    {cards.priceSells} ج.م
                </p>
            </div>
            <div className="bg-white shadow rounded-2xl p-4 text-center">
                <p className="text-gray-500">عدد العمليات</p>
                <p className="text-xl font-bold">{cards.countSells}</p>
            </div>
            <div className="bg-white shadow rounded-2xl p-4 text-center">
                <p className="text-gray-500">الربح</p>
                <p className="text-xl font-bold">{cards.win}</p>
            </div>
            <div className="bg-white shadow rounded-2xl p-4 text-center">
                <p className="text-gray-500">الخسارة</p>
                <p className="text-xl font-bold">{cards.lose}</p>
            </div>
            <div className="bg-white shadow rounded-2xl p-4 text-center">
                <p className="text-gray-500">عدد العمليات غير المدفوعة</p>
                <p className="text-xl font-bold">{cards.unPaid}</p>
            </div>
            <div className="bg-white shadow rounded-2xl p-4 text-center">
                <p className="text-gray-500">آخر عملية</p>
                <p className="text-xl font-bold">{cards.lastSell} ج.م</p>
            </div>
        </div>
    );
}

export default Status;