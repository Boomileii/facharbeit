export default function TransactionTable({ transactions }) {


    return (

        <div className="overflow-x-auto w-full ">
            <table className="table-auto border-collapse w-full">
                <thead className="">
                    <tr className="font-light">
                        <th className="px-2 py-1 text-left font-normal">From</th>
                        <th className="px-2 py-1 text-left font-normal">To</th>
                        <th className="px-2 py-1 text-left font-normal">Amount</th>

                    </tr>
                </thead>
                <tbody>
                    <tr className="border-y text-sm">
                        <td className="px-2 py-1">John Doe</td>
                        <td className="px-2 py-1">John doaoda</td>
                        <td className="px-2 py-1">50</td>
                    </tr>
                    <tr className="border-y text-sm">
                        <td className="px-2 py-1">John Doe</td>
                        <td className="px-2 py-1">John doaoda</td>
                        <td className="px-2 py-1">50</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )

}